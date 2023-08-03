import type {Kysely} from 'kysely';
import {tables} from '../../types/index.js';
import type {
  Database,
  Jutsu,
  JutsuInput,
  JutsuUpdates,
} from '../../types/index.js';

export class JutsuDal {
  readonly db!: Kysely<Database>;
  constructor(db: Kysely<Database>) {
    this.db = db;
  }

  async get(id: string): Promise<Jutsu | undefined> {
    return this.db
      .selectFrom(tables.JUTSUS)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async insert(jutsu: JutsuInput): Promise<Jutsu | undefined> {
    return this.db
      .insertInto(tables.JUTSUS)
      .values(jutsu)
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: string, updates: JutsuUpdates): Promise<Jutsu | undefined> {
    return this.db
      .updateTable(tables.JUTSUS)
      .where('id', '=', id)
      .set(updates)
      .returningAll()
      .executeTakeFirst();
  }

  async del(id: string): Promise<Jutsu | undefined> {
    return this.db
      .deleteFrom(tables.JUTSUS)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }
}
