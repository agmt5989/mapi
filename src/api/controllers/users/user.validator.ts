import { Joi, validate } from "express-validation";

export const createUserRequestSchema = {
  body: Joi.object({
    bvn: Joi.string().required().length(4), // last 4 digits
    phone: Joi.string().required(),
  }),
};

export const createPasswordRequestSchema = {
  body: Joi.object({
    password: Joi.string().required(),
  }),
  query: Joi.object({
    email: Joi.string().required(),
  }),
};

export const confirmEmailSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};

export const loginUserRequestSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
