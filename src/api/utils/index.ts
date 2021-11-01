import crytojs from 'crypto-js'

export function sleep(ms: number) {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
}
