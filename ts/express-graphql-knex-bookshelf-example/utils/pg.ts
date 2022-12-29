import knex from "../connections/postgres";
import { Ninja, NinjaUpdates, Jutsu, JutsuUpdates } from "../types";
import { getNowUTC } from "./utils";
import NinjaModel from "../models/ninja";
import JutsuModel from "../models/jutsu";

export const TABLES = {
  NINJAS: "ninjas",
  JUTSUS: "jutsus",
  NINJAS_JUTSUS: "ninjas_jutsus",
};

// TODO: move to providers file
// TODO: interface for DI/IoC
// TODO: add types to generic knex calls

// ---
// Ninjas
// ---

const getNinja = async (id: number): Promise<any> => {
  const ninja = await knex(TABLES.NINJAS).select("*").where({ id }).whereNull("deleted_at");
  return ninja;
};

const insertNinja = async (ninja: Ninja): Promise<any> => {
  const now = getNowUTC();
  const { first_name, last_name } = ninja;
  const [insertedNinja] = await knex(TABLES.NINJAS)
    .insert({
      first_name,
      last_name,
      created_at: now,
    })
    .returning("*");
  return insertedNinja;
};

const updateNinja = async (id: number, updates: NinjaUpdates): Promise<any> => {
  const now = getNowUTC();
  const [updatedNinja] = await knex(TABLES.NINJAS)
    .where({ id })
    .update({
      ...updates,
      updated_at: now,
    })
    .returning("*");
  return updatedNinja;
};

const deleteNinja = async (id: number): Promise<any> => {
  const now = getNowUTC();
  const [deletedNinja] = await knex(TABLES.NINJAS)
    .where({ id })
    .update({ deleted_at: now, updated_at: now })
    .returning("*");
  // delete ninjas_jutsus record?
  return deletedNinja;
};

// ---
// jutsus
// ---

const getJutsu = async (id: number): Promise<any> => {
  const jutsu = await knex(TABLES.JUTSUS).select("*").where({ id }).whereNull("deleted_at");
  return jutsu;
};

const insertJutsu = async (jutsu: Jutsu): Promise<any> => {
  const { name, chakra_nature, description } = jutsu;
  const now = getNowUTC();
  const [insertedJutsu] = await knex(TABLES.JUTSUS)
    .insert({
      name,
      chakra_nature,
      description,
      created_at: now,
    })
    .returning("*");
  return insertedJutsu;
};

const updateJutsu = async (id: number, updates: JutsuUpdates): Promise<any> => {
  const now = getNowUTC();
  const [updatedJutsu] = await knex(TABLES.JUTSUS)
    .where({ id })
    .update({
      ...updates,
      updated_at: now,
    })
    .returning("*");
  return updatedJutsu;
};

const deleteJutsu = async (id: number): Promise<any> => {
  const now = getNowUTC();
  const [deletedJutsu] = await knex(TABLES.JUTSUS)
    .where({ id })
    .update({
      deleted_at: now,
      updated_at: now,
    })
    .returning("*");
  // delete ninjas_jutsus record?
  return deletedJutsu;
};

// ---
// ninjas_jutsus
// ---

const getNinjaWithRelatedJutsu = async (id: number): Promise<any> => {
  // ninja is fetched with jutsu (where ninjas_jutsus and jutsus are null)
  // this could be simplified with hard, cascading deletes
  const response = await new NinjaModel({ id }).fetch({
    withRelated: [
      {
        [TABLES.JUTSUS]: (query) =>
          query
            .whereNull(`${TABLES.NINJAS_JUTSUS}.deleted_at`)
            .whereNull(`${TABLES.JUTSUS}.deleted_at`),
      },
    ],
    debug: true,
  });
  const ninjaWithKnownJutsu = response.toJSON();
  return ninjaWithKnownJutsu;
};

const getJutsuWithRelatedNinja = async (id: number): Promise<any> => {
  const response = await new JutsuModel({ id }).fetch({
    withRelated: [
      { [TABLES.NINJAS]: (query) => query.whereNull(`${TABLES.NINJAS_JUTSUS}.deleted_at`) },
    ],
  });
  const jutsuWithRelatedNinja = response.toJSON();
  return jutsuWithRelatedNinja;
};

const getKnownJutsu = async (ninja_id: number): Promise<any> => {
  const [knownJutsu] = await knex(TABLES.JUTSUS)
    .whereIn(
      "id",
      knex(TABLES.NINJAS_JUTSUS)
        .select("jutsu_id")
        .where({ ninja_id: ninja_id })
        .whereNull("deleted_at"),
    )
    .whereNull("deleted_at");
  return knownJutsu;
};

const addKnownJutsu = async (ninja_id: number, jutsu_id: number): Promise<any> => {
  const now = getNowUTC();
  await knex(TABLES.NINJAS_JUTSUS)
    .insert({
      ninja_id,
      jutsu_id,
      created_at: now,
    })
    .returning("*");
  const ninja = await getNinjaWithRelatedJutsu(ninja_id);
  console.log("TCL ~ file: pg.ts ~ line 139 ~ addKnownJutsu ~ ninja", ninja);
  return ninja;
};

const removeKnownJutsu = async (ninja_id: number, jutsu_id: number): Promise<any> => {
  const now = getNowUTC();
  await knex(TABLES.NINJAS_JUTSUS)
    .where({ ninja_id, jutsu_id })
    .update({
      deleted_at: now,
      updated_at: now,
    })
    .returning("*");
  const ninja = await getNinjaWithRelatedJutsu(ninja_id);
  return ninja;
};

// ---
// exports
// ---

const pg = {
  // ninjas
  getNinja,
  insertNinja,
  updateNinja,
  deleteNinja,
  // jutsu
  getJutsu,
  insertJutsu,
  updateJutsu,
  deleteJutsu,
  // ninjas_jutsus
  getKnownJutsu,
  addKnownJutsu,
  removeKnownJutsu,
  // withRelated (ninjas & jutsu)
  getNinjaWithRelatedJutsu,
  getJutsuWithRelatedNinja,
};

export default pg;

// ---
// many-to-many
// ---

// https://stackoverflow.com/a/61095190

// ---
// naive many-to-many
// ---

// const getKnownJutsu = async (ninjaId: number): Promise<any> | null => {
//   const knownJutsuLookup = await knex("jutsu_lookup")
//     .select("*")
//     .where({ ninjaId });
//   const knownJutsuIds = knownJutsuLookup.map((j) => j.jutsuId);
//   const knownJutsu = await knex("jutsu")
//     .select("*")
//     .whereIn("id", knownJutsuIds);
//   return knownJutsu;
// };
