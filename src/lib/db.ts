import mysql, { QueryResult, FieldPacket } from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "3306"),
      ssl: {
        rejectUnauthorized: true,
      },
      // Optimized pool settings for serverless
      connectionLimit: 5,
      idleTimeout: 300000, // 5 minutes
      queueLimit: 0
    });

    console.log("Database pool created");
  }

  return pool;
}

// Simplified method that uses pool directly (no need to get/release connections manually)
export async function executeQuery(query: string, params?: unknown[]): Promise<[QueryResult, FieldPacket[]]> {
  const pool = getDbPool();
  return pool.execute(query, params);
}

export async function closeDbConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
