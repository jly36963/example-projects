import {getPgDal} from './pg/index.js';
import {Logger} from './logger/index.js';
import {Providers} from '../types/index.js';

export function getProviders({pgUrl}: {pgUrl: string}): Providers {
  return {
    pgDal: getPgDal(pgUrl),
    logger: new Logger(),
  };
}
