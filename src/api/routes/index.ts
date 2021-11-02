import express, { NextFunction, Response, Request } from 'express';
import apiStatusCodes from '../utils/ApiStatusCodes';
import ApiResponse from '../utils/ApiResponse';
import { ValidationError } from 'express-validation';
import { validationErrorWrapper } from './exceptionHandler';

import userRoutes from '../controllers/users';


const indexRoutes = express.Router();

indexRoutes.use('/users', userRoutes);
indexRoutes.use(validationErrorWrapper);


indexRoutes.get('/', (req, res) => {
  return ApiResponse.send(res, apiStatusCodes.success, 'This app is running.');
});

indexRoutes.get('*', (req, res) => {
  return ApiResponse.send(res, apiStatusCodes.notFound, 'Endpoint not found.');
});

export default indexRoutes;