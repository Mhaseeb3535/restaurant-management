import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  user: "postgres",
  password: "mhrajp35",
  host: "localhost",
  port: 5432,
  database: "restaurant",
});

export default pool;
