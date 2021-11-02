import express, { NextFunction, Request, Response } from 'express';
import { validate } from 'express-validation';
import { createUserRequestSchema, loginUserRequestSchema, confirmEmailSchema, createPasswordRequestSchema } from './user.validator';
import { UserController } from './user.controller';


const userRoutes = express.Router();

const controller = new UserController();

userRoutes.post('/login', validate(createUserRequestSchema), controller.login);
userRoutes.post('/get-started', validate(loginUserRequestSchema), controller.getStarted);
userRoutes.post('/confirm-email', validate(confirmEmailSchema), controller.confirmEmail);
userRoutes.post('/create-password/:email', validate(createPasswordRequestSchema), controller.createPassword);


export default userRoutes;