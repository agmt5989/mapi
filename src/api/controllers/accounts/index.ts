
import express from 'express';
import { validate } from 'express-validation';
import { toggleAccountRequestSchema } from './account.validator';
import AccountController from './account.controller';
import { JWT } from 'api/middlewares/jwt';


const accountRoutes = express.Router();

const controller = new AccountController();

accountRoutes.get("/", controller.getAccounts);
accountRoutes.post(
  "/toggle",
  validate(toggleAccountRequestSchema),
  controller.toggleAccounts
);

export default accountRoutes;
