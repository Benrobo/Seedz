import {
  ApiAddProductProp,
  ApiProductCheckoutProps,
  FundWalletType,
} from "../../../@types";
import prisma from "../config/prisma";
import ServerResponseError from "../helper/errorHandler";
import {
  AddProductSchema,
  InitPaymentSchema,
  ProductCheckoutSchema,
} from "../helper/validator";
import { genID } from "../helper";
import $http from "../config/axios";

type productQtyArray = { prodId: string; qty: number; name: string }[];
export default class ProductController {
  constructor() {}

  private isValidationError(error: any) {
    return typeof error !== "undefined";
  }

  private async validateProductQuantities(productQtyArray: productQtyArray) {
    const products = await this.checkAvailableQuantities(productQtyArray);

    const validationResults = productQtyArray.map((item) => {
      const requestedQty = item.qty;
      const product = products.find((p) => p.id === item.prodId);
      if (!product) {
        return {
          prodId: item.prodId,
          notValid: false,
          name: item.name,
          reason: "Product not found",
        };
      }
      const availableQty = product.quantity;
      const isValid = requestedQty > availableQty;

      return {
        prodId: item.prodId,
        notValid: isValid,
        name: item.name,
        reason: isValid ? "Limited quantity" : "Available",
      };
    });

    return validationResults;
  }

  private async checkAvailableQuantities(productQtyArray: productQtyArray) {
    const productIds = productQtyArray.map((item) => item.prodId);
    const products = await prisma.products.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const foundProductIds = products.map((product) => product.id);
    const missingProductIds = productIds.filter(
      (id) => !foundProductIds.includes(id)
    );

    if (missingProductIds.length > 0) {
      const missingProductNames = missingProductIds.map((id) => {
        const productQty = productQtyArray.find((item) => item.prodId === id);
        return productQty ? productQty?.name : "Unknown Product";
      });

      throw new ServerResponseError(
        "PRODUCT_NOT_FOUND",
        `The following products are not available: ${missingProductNames.join(
          ", "
        )}`
      );
    }

    return products;
  }

  private async extractProductInfo(productQtyArray: productQtyArray) {
    const info = await Promise.all(
      productQtyArray.map(async (item) => {
        const id = item.prodId;
        const prodSeller = await prisma.products.findFirst({
          where: { id },
          include: { user: true },
        });
        const amount = prodSeller?.availableForRent
          ? prodSeller?.rentingPrice
          : prodSeller?.price;
        return {
          id,
          amount: amount as number,
          qty: item.qty,
          userInfo: {
            // sellers info
            id: prodSeller?.user?.id,
            email: prodSeller?.user?.email,
            name: prodSeller?.user?.fullname,
          },
        };
      })
    );

    const totalAmount = info
      .map((item) => item?.amount * item?.qty)
      .reduce((acc, t) => (acc += t));

    return {
      info,
      totalAmount,
    };
  }

  async addProduct(payload: ApiAddProductProp, userId: string) {
    const { error, value } = AddProductSchema.validate(payload);
    if (this.isValidationError(error)) {
      throw new ServerResponseError("INVALID_FIELDS", (error as any).message);
    }

    const {
      availableForRent,
      image,
      category,
      description,
      name,
      price,
      rentingPrice,
      quantity,
    } = payload;

    await prisma.products.create({
      data: {
        id: genID(20),
        name,
        type: category,
        price,
        availableForRent,
        rentingPrice,
        image: {
          create: {
            hash: image.hash,
            url: image.url,
          },
        },
        description,
        currency: "NGN",
        userId,
        quantity,
      },
    });

    return { success: true, msg: "Product created successfully." };
  }

  async getProducts() {
    return await prisma.products.findMany({
      include: { image: true, ratings: true, user: true },
    });
  }

  async productCheckout(payload: ApiProductCheckoutProps, userId: string) {
    const { error, value } = ProductCheckoutSchema.validate(payload);
    if (this.isValidationError(error)) {
      throw new ServerResponseError("INVALID_FIELDS", (error as any).message);
    }

    const { totalAmount, productQty } = payload;

    const buyerInfo = await prisma.users.findFirst({
      where: { id: userId },
      include: { wallet: true },
    });
    const hasSufficientQty = await this.validateProductQuantities(productQty);
    const insufficientQty = hasSufficientQty.filter((d) => d.notValid);

    if (insufficientQty.length > 0) {
      const prodNames = insufficientQty.map((d) => d.name);
      const msg =
        insufficientQty.length > 1
          ? `Limited Quantities for this products: ${prodNames.join(", ")} `
          : `Limited Quantity for ${prodNames[0]}`;
      throw new ServerResponseError("LIMITED_QUANTITY", msg);
    }

    // check balance
    const prodInfo = await this.extractProductInfo(productQty);

    console.log(prodInfo.totalAmount);
    // console.log(prodInfo.info.map((d) => d.userInfo));

    if (prodInfo.totalAmount !== totalAmount) {
      throw new ServerResponseError(
        "INVALID_TOTAL_AMOUNT",
        "Total checkout amout is invalid"
      );
    }

    // const totalCheckoutBal = productQty?.map(qty => qty.)
    const debUser = await prisma.users.findFirst({
      where: { id: userId },
      include: { wallet: true },
    });

    if ((debUser?.wallet?.balance as number) < totalAmount) {
      throw new ServerResponseError(
        "INSUFFICIENT_BALANCE",
        "Insufficient Balance"
      );
    }

    // update quantity for each product

    // handle crediting of sellers acount
    // Calculate total debited amount and total credited amount
    let totalDebitedAmount = 0;
    let totalCreditedAmount = 0;
    let buyerWalletBal = null;
    let sellerWalletBal = null;

    await Promise.all(
      prodInfo?.info.map(async (data, i) => {
        const amount = data.amount;
        const prodSum = data.qty * amount;
        const userInfo = data.userInfo;
        const buyerId = userId;

        const product = await prisma.products.findFirst({
          where: { id: data?.id },
        });

        // Update product quantity
        const updatedQty = (product as any)?.quantity - data?.qty;

        // Save the updated quantity back to the database
        await prisma.products.update({
          where: { id: data?.id },
          data: { quantity: updatedQty },
        });

        // is buyer and seller at same time ❌
        if (userInfo?.id === buyerId) {
          throw new ServerResponseError(
            "FORBIDDEN_ACTION",
            "You aren't allowed to buy your own product."
          );
        } else {
          totalDebitedAmount += prodSum;
          totalCreditedAmount += prodSum;

          // Get buyer's wallet balance
          buyerWalletBal = await prisma.wallet.findFirst({
            where: { userId: buyerInfo?.id as string },
            include: { user: true },
          });

          // Get seller's wallet balance
          sellerWalletBal = await prisma.wallet.findFirst({
            where: { userId: userInfo.id as string },
            include: { user: true },
          });
        }
      })
    );

    // Calculate updated balances
    const updatedBuyerBalance =
      (buyerWalletBal as any)?.balance - totalDebitedAmount;
    const updatedSellerBalance =
      (sellerWalletBal as any)?.balance + totalCreditedAmount;

    // Update buyer's wallet balance
    if (buyerWalletBal !== null) {
      await prisma.wallet.update({
        where: { userId },
        data: {
          balance: updatedBuyerBalance,
        },
      });
      console.log(`Debited ${buyerInfo?.email} : ${totalDebitedAmount}`);
    }

    // Update seller's wallet balance
    if (sellerWalletBal !== null) {
      await prisma.wallet.update({
        where: { userId: (sellerWalletBal as any)?.userId },
        data: {
          balance: updatedSellerBalance,
        },
      });
      console.log(
        `Credited ${
          (sellerWalletBal as any)?.user?.email
        } : ${totalCreditedAmount}`
      );
    }

    // return success
    return { success: true };
  }
}
