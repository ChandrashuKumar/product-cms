import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Initialize database and tables first (this creates the database)
    const initialized = await initializeDatabase();
    
    if (initialized) {
      // Test sample query
      const [rows] = await executeQuery(
        'SELECT product_id, product_name, status FROM Products LIMIT 2'
      );
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        sampleData: rows
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Database connection successful but initialization failed'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}