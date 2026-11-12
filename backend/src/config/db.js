
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isProduction = Boolean(process.env.DATABASE_URL);

const pool = isProduction
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      options: "-c search_path=researchgraph",
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD || undefined,
      port: process.env.DB_PORT || 5432,
    });

export async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    const schema = await pool.query("SHOW search_path");

    console.log("PostgreSQL connected successfully!");
    console.log("Database time:", result.rows[0].now);
    console.log("Database schema:", schema.rows[0].search_path);
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
}

export default pool;
