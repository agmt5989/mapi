import { ICustomer } from 'api/models/customers';
import crytojs from 'crypto-js'
import jwt from 'jsonwebtoken';

export function sleep(ms: number) {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
}

export const timestamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

export const generateJWT = (customer: ICustomer) => {
  const token = jwt.sign({
    id: customer._id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    bvn: customer.bvn,
    app: customer.app
  }, process.env.JWT_SECRET || 'A5KPb64mdHfad1J5', { expiresIn: '24h' });
  return token;
}

export function generateRandomString(length = 13, type: 'numbers' | 'characters'): string {
  const chars =  type === 'numbers' ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const rands = [];
  let i = -1;
  while (++i < length) {
    // @ts-ignore
    rands.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }
  return rands.join('');
}

