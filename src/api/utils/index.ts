import { ICustomer } from 'api/models/customers';
import { IPortalUser } from 'api/models/portalUser';
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

export const generateJWT = (user: IPortalUser) => {
  const token = jwt.sign({
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    bvn: user.bvn,
  }, process.env?.JWT_SECRET || '', { expiresIn: '24h' });
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

