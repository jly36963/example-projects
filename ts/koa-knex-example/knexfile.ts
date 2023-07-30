const pgUrl = process.env.PG_URL

export default {
  development: {
    client: 'pg',
    connection: pgUrl,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './providers/pg/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: pgUrl,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './providers/pg/migrations',
    },
  },
};
