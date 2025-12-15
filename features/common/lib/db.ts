import { DB } from "generated/kysely/types";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: pool,
  }),
});
