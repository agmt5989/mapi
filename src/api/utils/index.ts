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
