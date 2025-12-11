import {getPgDal} from './pg/index.js';
import {Providers} from '../types/index.js';

export function getProviders({pgUrl}: {pgUrl: string}): Providers {
  return {
    pgDal: getPgDal(pgUrl),
  };
}
