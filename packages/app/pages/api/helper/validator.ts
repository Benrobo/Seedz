import Joi from "joi";

export const CreateUserSchema = Joi.object({
  email: Joi.string().required().email(),
  fullname: Joi.string().required(),
  id: Joi.string().required(),
  role: Joi.string().required(),
});
