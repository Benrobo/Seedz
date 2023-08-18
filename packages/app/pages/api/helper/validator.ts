import Joi from "joi";

export const CreateUserSchema = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});
