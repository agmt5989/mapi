import express, { NextFunction, Request, Response } from 'express';
import { validate } from 'express-validation';
import { createUserRequestSchema, loginUserRequestSchema } from './user.validator';
import { UserController } from './user.controller';


const userRoutes = express.Router();

const controller = new UserController();

userRoutes.post('/login', validate(createUserRequestSchema), controller.login);
userRoutes.post('/regiter', validate(loginUserRequestSchema), controller.register);
