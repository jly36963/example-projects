import Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  // ninjas
  await knex.schema.createTable("ninjas", (table) => {
    table.increments(); // id (int unsigned not null auto_increment primary key)
    table.string("first_name").notNullable(); // first_name (varchar(255))
    table.string("last_name").notNullable(); // last_name (varchar(255))
    table.timestamps(); // created_at & updated_at
    table.timestamp("deleted_at"); // deleted_at
  });
  // jutsus
  await knex.schema.createTable("jutsus", (table) => {
    table.increments(); // id (int unsigned not null auto_increment primary key)
    table.string("name"); // name (varchar(255))
    table.string("chakra_nature").notNullable(); // chakra_natures (varchar(255))
    table.string("description").notNullable(); // description (varchar(255))
    table.timestamps(); // created_at & updated_at
    table.timestamp("deleted_at"); // deleted_at
  });
  // ninjas_jutsus
  await knex.schema.createTable("ninjas_jutsus", (table) => {
    table.increments(); // id (int unsigned not null auto_increment primary key)
    table
      .integer("ninja_id")
      .unsigned()
      .references("ninjas.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("jutsu_id")
      .unsigned()
      .references("jutsus.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamps(); // created_at & updated_at
    table.timestamp("deleted_at"); // deleted_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("ninjas_jutsus");
  await knex.schema.dropTable("ninjas");
  await knex.schema.dropTable("jutsus");
}

// two ways to write relation

// table.integer('ninja_id').unsigned().references('ninjas.id')

// table.integer("ninja_id").unsigned();
// table.foreign("ninja_id").references("id").inTable("ninjas");
