import express from "express";
import { validate } from "express-validation";
import { toggleAppRequestSchema } from "./app.validator";
import { AppController } from "./app.controller";
import { JWT } from "api/middlewares/jwt";

const accountRoutes = express.Router();

const controller = new AppController();

accountRoutes.get("/", controller.getApps);
accountRoutes.post(
  "/toggle",
  validate(toggleAppRequestSchema),
  controller.toggleApps
);

export default accountRoutes;
