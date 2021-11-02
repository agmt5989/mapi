import crytojs from 'crypto-js'

export function sleep(ms: number) {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
}

export const timestamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};


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

