import mysql from "mysql2/promise";

let connection: mysql.Connection | null = null;

export async function getDbConnection(): Promise<mysql.Connection> {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "3306"),
        ssl: {
          // SkySQL requires SSL, so you can enable it like this:
          rejectUnauthorized: true,
        },
      });

      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Failed to connect to database");
    }
  }

  return connection;
}

export async function closeDbConnection(): Promise<void> {
  if (connection) {
    await connection.end();
    connection = null;
  }
}
