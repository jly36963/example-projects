import knexFactory from 'knex';
import KnexStringcase from 'knex-stringcase';
import {NinjaDal} from './ninjas.js';
import {JutsuDal} from './jutsus.js';

/** Initialize pg/knex connection and return pg dal */
export function getPgDal(pgUrl: string): PgDal {
  const knexPool = knexFactory(
    KnexStringcase({
      client: 'pg',
      connection: pgUrl,
      pool: {min: 2, max: 10},
    })
  );

  const pgDal: PgDal = {
    ninjas: new NinjaDal(knexPool),
    jutsus: new JutsuDal(knexPool),
  };
  return pgDal;
}

export interface PgDal {
  ninjas: NinjaDal;
  jutsus: JutsuDal;
}
