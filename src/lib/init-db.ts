import mysql from 'mysql2/promise';

export async function initializeDatabase(): Promise<boolean> {
  try {
    // First connect without specifying database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "3306"),
      ssl: {
        rejectUnauthorized: true,
      },
    });
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.execute(`USE ${process.env.DB_NAME}`);
    
    console.log('Database created/selected successfully');
    
    // Create Products table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Products (
          product_id      INT AUTO_INCREMENT PRIMARY KEY,
          product_name    VARCHAR(100) NOT NULL,
          product_desc    TEXT,
          status          ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
          
          -- Audit Columns
          created_by      VARCHAR(50) NOT NULL,
          created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_by      VARCHAR(50),
          updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          is_deleted      BOOLEAN DEFAULT FALSE,
          
          -- Indexes for better performance
          INDEX idx_status (status),
          INDEX idx_created_at (created_at),
          INDEX idx_is_deleted (is_deleted)
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('Products table created successfully');
    
    // Check if sample data exists
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Products');
    const count = (rows as any)[0].count;
    
    if (count === 0) {
      // Insert sample data
      const sampleDataQuery = `
        INSERT INTO Products (product_name, product_desc, created_by, status) VALUES 
        ('Product A', 'Description for Product A', 'admin', 'Draft'),
        ('Product B', 'Description for Product B', 'admin', 'Published')
      `;
      
      await connection.execute(sampleDataQuery);
      console.log('Sample data inserted successfully');
    }
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}