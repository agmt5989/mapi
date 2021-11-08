import express, { NextFunction, Response, Request } from "express";
import apiStatusCodes from "../utils/ApiStatusCodes";
import ApiResponse from "../utils/ApiResponse";
import { ValidationError } from "express-validation";
import { validationErrorWrapper } from "../exceptions/validaitonExceptionHandler";
import { JWT } from "../middlewares/jwt";

import userRoutes from "../controllers/users";
import appRoutes from "../controllers/apps";
import accountRoutes from "../controllers/accounts";

const indexRoutes = express.Router();

indexRoutes.use("/users", userRoutes);
indexRoutes.use("/accounts", JWT, accountRoutes);
indexRoutes.use("/apps", JWT, appRoutes);
indexRoutes.use(validationErrorWrapper);

indexRoutes.get("/", (req, res) => {
  return ApiResponse.send(res, apiStatusCodes.success, "This app is running.");
});

indexRoutes.get("*", (req, res) => {
  return ApiResponse.send(res, apiStatusCodes.notFound, "Endpoint not found.");
});

export default indexRoutes;
