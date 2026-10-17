import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL?.trim();
const hasDatabaseUrl = Boolean(databaseUrl);

const pool = new Pool({
  ...(databaseUrl ? { connectionString: databaseUrl } : {}),
  max: process.env.VERCEL === "1" ? 1 : 10,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? {
          rejectUnauthorized:
            process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
        }
      : undefined,
});

export default {
  query(...args) {
    if (!hasDatabaseUrl) {
      throw new Error("DATABASE_URL is not configured");
    }
    return pool.query(...args);
  },
  end() {
    return pool.end();
  },
};
