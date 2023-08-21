import Joi from "joi";

export const CreateUserSchema = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

export const InitPaymentSchema = Joi.object({
  amount: Joi.string().required(),
  currency: Joi.string().required(),
});

export const AddProductSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  availableForRent: Joi.boolean().required(),
  rentingPrice: Joi.number().required(),
  image: Joi.object({
    url: Joi.string().required(),
    hash: Joi.string().required(),
  }),
  quantity: Joi.number().required().min(1),
  description: Joi.string().required(),
});

export const ProductCheckoutSchema = Joi.object({
  totalAmount: Joi.number().required(),
  productQty: Joi.array()
    .items(
      Joi.object({
        prodId: Joi.string().required(),
        name: Joi.string().required(),
        qty: Joi.number().required(),
      })
    )
    .required(),
});
