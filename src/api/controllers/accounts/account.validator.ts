import { Joi, validate } from 'express-validation';

export const toggleAccountRequestSchema = {
  body: Joi.object({
    accountNumber: Joi.string().required(),
    link: Joi.boolean().required(),
  }),
};