import { sysLogger } from '@shared/Logger';

// Util functions
export const pErr = (err: Error) => {
  if (err) {
    sysLogger.error(err);
  }
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};
