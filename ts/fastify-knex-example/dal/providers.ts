import {pgdal, PGDAL} from './pg';

export interface Providers {
  pgdal: PGDAL;
}

export const providers: Providers = {
  pgdal,
};
