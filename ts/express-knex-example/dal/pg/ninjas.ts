import knex from './connection';
import tables from './tables';
import { Ninja, Jutsu } from '../../types';
import { pick, first } from 'lodash-es';

const get = async (id: string): Promise<Ninja | undefined> =>
  knex<Ninja>(tables.NINJAS).select('*').where({ id }).first();

const insert = async (
  ninja: Pick<Ninja, 'firstName' | 'lastName' | 'age'>,
): Promise<Ninja | undefined> => {
  const result = await knex<Ninja>(tables.NINJAS)
    .insert(pick(ninja, ['firstName', 'lastName', 'age']))
    .returning('*');
  return first(result);
};

const update = async (
  id: string,
  updates: Partial<Ninja>,
): Promise<Ninja | undefined> => {
  const result = await knex<Ninja>(tables.NINJAS)
    .where({ id })
    .update(updates)
    .returning('*');
  return first(result);
};

const del = async (id: string): Promise<Ninja | undefined> => {
  const result = await knex<Ninja>(tables.NINJAS)
    .where({ id })
    .del()
    .returning('*');
  return first(result);
};

const associateJutsu = async (
  ninjaId: string,
  jutsuId: string,
): Promise<void> => knex(tables.NINJAS_JUTSUS).insert({ ninjaId, jutsuId });

const getNinjaWithJutsus = async (
  ninjaId: string,
): Promise<Ninja | undefined> => {
  const [ninja, jutsus] = await Promise.all([
    knex<Ninja>(tables.NINJAS).select('*').where({ id: ninjaId }).first(),
    knex<Jutsu>(tables.JUTSUS)
      .select('*')
      .whereIn(
        'id',
        knex(tables.NINJAS_JUTSUS).select('jutsuId').where({ ninjaId }),
      ),
  ]);
  return ninja && jutsus ? { ...ninja, jutsus } : undefined;
};

export default { get, insert, update, del, associateJutsu, getNinjaWithJutsus };
