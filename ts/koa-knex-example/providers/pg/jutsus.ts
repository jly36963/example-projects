import tables from './tables.js';
import {pick, first} from 'lodash-es';
import type {Knex} from 'knex';
import type {Jutsu, JutsuInput, JutsuUpdates} from '../../types';

export class JutsuDal {
  readonly conn!: Knex;
  constructor(conn: Knex) {
    this.conn = conn;
  }

  async get(id: string): Promise<Jutsu | undefined> {
    const result = await this.conn<Jutsu>(tables.JUTSUS)
      .select('*')
      .where({id});
    return first(result);
  }

  async insert(jutsu: JutsuInput): Promise<Jutsu | undefined> {
    const result = await this.conn<Jutsu>(tables.JUTSUS)
      .insert(pick(jutsu, ['name', 'chakraNature', 'description']))
      .returning('*');
    return first(result);
  }

  async update(id: string, updates: JutsuUpdates): Promise<Jutsu | undefined> {
    const result = await this.conn<Jutsu>(tables.JUTSUS)
      .where({id})
      .update(updates)
      .returning('*');
    return first(result);
  }

  async del(id: string): Promise<Jutsu | undefined> {
    const result = await this.conn<Jutsu>(tables.JUTSUS)
      .where({id})
      .del()
      .returning('*');
    return first(result);
  }
}
