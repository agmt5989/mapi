import express, { NextFunction, Request, Response } from "express";
import { validate } from "express-validation";
import {
  createUserRequestSchema,
  loginUserRequestSchema,
  confirmEmailSchema,
  createPasswordRequestSchema,
} from "./user.validator";
import { UserController } from "./user.controller";

const userRoutes = express.Router();

const controller = new UserController();

userRoutes.post("/login", validate(loginUserRequestSchema), controller.login);
userRoutes.post(
  "/get-started",
  validate(createUserRequestSchema),
  controller.getStarted
);
userRoutes.post(
  "/confirm-email",
  validate(confirmEmailSchema),
  controller.confirmEmail
);
userRoutes.post(
  "/create-password",
  validate(createPasswordRequestSchema),
  controller.createPassword
);
userRoutes.post(
  "/resend-otp",
  validate(createUserRequestSchema),
  controller.resendVerficationLink
);

export default userRoutes;
