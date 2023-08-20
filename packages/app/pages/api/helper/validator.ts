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
  price: Joi.string().required(),
  availableForRent: Joi.boolean().required(),
  rentingPrice: Joi.string().required(),
  base64Image: Joi.string().required(),
  description: Joi.string().required(),
});
