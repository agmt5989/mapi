import { Joi, validate } from 'express-validation';

export const createUserRequestSchema = {
  body: Joi.object({
    bvn: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required()
  }),
};