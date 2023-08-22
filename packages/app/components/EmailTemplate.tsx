import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

interface ProductCheckoutTempProps {
  fullname: string;
  email: string;
  isBuyer: boolean;
  products: Array<{
    name: string;
    qty: number;
    amount: string;
  }>;
  type: "DEBIT" | "CREDIT";
  amount: number;
}

export const ProductCheckoutTemp: React.FC<
  Readonly<ProductCheckoutTempProps>
> = ({ fullname, email, isBuyer, products, amount, type }) => (
  <div>
    <h1>Hi, {fullname}!</h1>
    <p>{isBuyer ? null : `Order has been placed by ${email}`}</p>
    <p>
      {isBuyer
        ? `Thank you for your recent ${
            type === "DEBIT" ? "purchase" : "transaction"
          }`
        : null}
    </p>
    <p>Here are the details:</p>
    <ul>
      {products.map((product, index) => (
        <li key={index}>
          <strong>Product:</strong> {product.name} ({product.qty} qty)
          <br />
          <strong>Amount:</strong> ₦{product.amount}
        </li>
      ))}
    </ul>
    <p>
      Your{" "}
      {type === "DEBIT"
        ? `wallet has been debited`
        : `wallet has been credited`}{" "}
      with the corresponding amount of ₦{amount}
    </p>

    <p>Best regards,</p>
    <p>The Seedz Team</p>
  </div>
);
