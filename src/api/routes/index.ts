import express, { NextFunction, Response, Request } from 'express';
import apiStatusCodes from '../utils/ApiStatusCodes';
import ApiResponse from '../utils/ApiResponse';
import { ValidationError } from 'express-validation';


const indexRoutes = express.Router();

indexRoutes.use(function (err, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  return res.status(apiStatusCodes.serverError).json(err)
})

indexRoutes.get('/', (req, res) => {
  return ApiResponse.send(res, apiStatusCodes.success, 'This app is running.');
});

indexRoutes.get('*', (req, res) => {
  return ApiResponse.send(res, apiStatusCodes.notFound, 'Endpoint not found.');
});

export default indexRoutes;