import { Joi, validate } from "express-validation";

export const toggleAppRequestSchema = {
  body: Joi.object({
    app: Joi.string().required(),
    link: Joi.boolean().required(),
  }),
};
