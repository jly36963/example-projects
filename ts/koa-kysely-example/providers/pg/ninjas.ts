import {tables} from '../../types/index.js';
import type {Kysely} from 'kysely';
import type {
  Database,
  Ninja,
  NinjaWithJutsus,
  NinjaInput,
  NinjaUpdates,
} from '../../types';

export class NinjaDal {
  readonly db!: Kysely<Database>;
  constructor(db: Kysely<Database>) {
    this.db = db;
  }

  async get(id: string): Promise<Ninja | undefined> {
    return this.db
      .selectFrom(tables.NINJAS)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async insert(ninja: NinjaInput): Promise<Ninja | undefined> {
    return this.db
      .insertInto(tables.NINJAS)
      .values(ninja)
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: string, updates: NinjaUpdates): Promise<Ninja | undefined> {
    return this.db
      .updateTable(tables.NINJAS)
      .where('id', '=', id)
      .set(updates)
      .returningAll()
      .executeTakeFirst();
  }

  async del(id: string): Promise<Ninja | undefined> {
    return this.db
      .deleteFrom(tables.NINJAS)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  async associateJutsu(ninjaId: string, jutsuId: string): Promise<void> {
    await this.db
      .insertInto(tables.NINJAS_JUTSUS)
      .values({ninjaId, jutsuId})
      .execute();
  }

  async disassociateJutsu(ninjaId: string, jutsuId: string): Promise<void> {
    await this.db
      .deleteFrom(tables.NINJAS_JUTSUS)
      .where('ninjaId', '=', ninjaId)
      .where('jutsuId', '=', jutsuId)
      .execute();
  }

  async getNinjaWithJutsus(id: string): Promise<NinjaWithJutsus | undefined> {
    const [ninja, jutsus] = await Promise.all([
      this.db
        .selectFrom(tables.NINJAS)
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst(),
      this.db
        .selectFrom(tables.JUTSUS)
        .selectAll()
        .where(
          'id',
          'in',
          this.db
            .selectFrom(tables.NINJAS_JUTSUS)
            .select('jutsuId')
            .where('ninjaId', '=', id)
        )
        .execute(),
    ]);
    if (!ninja) return undefined;
    return {...ninja, jutsus: jutsus ?? []};
  }
}
