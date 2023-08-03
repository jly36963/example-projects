import {Database, PgConfig} from '../../types/index.js';
import pg from 'pg';
import pgcs from 'pg-connection-string';
import {Kysely, PostgresDialect, CamelCasePlugin} from 'kysely';

import {NinjaDal} from './ninjas.js';
import {JutsuDal} from './jutsus.js';

const {Pool} = pg;
const {parse: parseConnectionString} = pgcs;

/** Initialize pg/kysely connection and return pg dal */
export function getPgDal(pgUrl: string): PgDal {
  const pgConfig = PgConfig.parse(parseConnectionString(pgUrl));

  const dialect = new PostgresDialect({
    pool: new Pool({
      ...pgConfig,
      min: 2,
      max: 10,
    }),
  });

  const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });

  const pgDal: PgDal = {
    ninjas: new NinjaDal(db),
    jutsus: new JutsuDal(db),
  };
  return pgDal;
}

export interface PgDal {
  ninjas: NinjaDal;
  jutsus: JutsuDal;
}
