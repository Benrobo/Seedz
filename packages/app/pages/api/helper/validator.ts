import Joi from "joi";

export const CreateUserSchema = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

export const InitPaymentSchema = Joi.object({
  amount: Joi.string().required(),
  currency: Joi.string().required(),
});
