import tables from "./tables.js";
import { pick, first } from "lodash-es";
import type { Knex } from "knex";
import type {
  Ninja,
  Jutsu,
  NinjaWithJutsus,
  NinjaInput,
  NinjaUpdates,
} from "../../types";

export class NinjaDal {
  readonly conn!: Knex;
  constructor(conn: Knex) {
    this.conn = conn;
  }

  async get(id: string): Promise<Ninja | undefined> {
    return this.conn<Ninja>(tables.NINJAS).select("*").where({ id }).first();
  }

  async insert(ninja: NinjaInput): Promise<Ninja | undefined> {
    const result = await this.conn<Ninja>(tables.NINJAS)
      .insert(pick(ninja, ["firstName", "lastName", "age"]))
      .returning("*");
    return first(result);
  }

  async update(id: string, updates: NinjaUpdates): Promise<Ninja | undefined> {
    const result = await this.conn<Ninja>(tables.NINJAS)
      .where({ id })
      .update(updates)
      .returning("*");
    return first(result);
  }

  async del(id: string): Promise<Ninja | undefined> {
    const result = await this.conn<Ninja>(tables.NINJAS)
      .where({ id })
      .del()
      .returning("*");
    return first(result);
  }

  async associateJutsu(ninjaId: string, jutsuId: string): Promise<void> {
    return this.conn(tables.NINJAS_JUTSUS).insert({ ninjaId, jutsuId });
  }

  async disassociateJutsu(ninjaId: string, jutsuId: string): Promise<void> {
    return this.conn(tables.NINJAS_JUTSUS).where({ ninjaId, jutsuId }).del();
  }

  async getNinjaWithJutsus(id: string): Promise<NinjaWithJutsus | undefined> {
    const [ninja, jutsus] = await Promise.all([
      this.conn<Ninja>(tables.NINJAS).select("*").where({ id }).first(),
      this.conn<Jutsu>(tables.JUTSUS)
        .select("*")
        .whereIn(
          "id",
          this.conn(tables.NINJAS_JUTSUS)
            .select("jutsuId")
            .where({ ninjaId: id })
        ),
    ]);
    if (!ninja) return undefined;
    return { ...ninja, jutsus: jutsus ?? [] };
  }
}
