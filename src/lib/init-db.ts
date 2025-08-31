import { executeQuery } from './db';

export async function initializeDatabase(): Promise<boolean> {
  try {
    
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
    
    await executeQuery(createTableQuery);
    console.log('Products table created successfully');
    
    // Check if sample data exists
    const [rows] = await executeQuery('SELECT COUNT(*) as count FROM Products');
    const count = (rows as { count: number }[])[0].count;
    
    if (count === 0) {
      // Insert sample data
      const sampleDataQuery = `
        INSERT INTO Products (product_name, product_desc, created_by, status) VALUES 
        ('Product A', 'Description for Product A', 'admin', 'Draft'),
        ('Product B', 'Description for Product B', 'admin', 'Published')
      `;
      
      await executeQuery(sampleDataQuery);
      console.log('Sample data inserted successfully');
    }
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}