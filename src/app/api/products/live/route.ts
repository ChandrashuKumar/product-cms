import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Get only published products that are not deleted
    const [rows] = await executeQuery(
      'SELECT product_id, product_name, product_desc, created_at, updated_at FROM Products WHERE status = ? AND is_deleted = FALSE ORDER BY created_at DESC',
      ['Published']
    );
    
    return NextResponse.json({
      success: true,
      data: rows,
      message: 'Live products fetched successfully'
    });
    
  } catch (error) {
    console.error('GET /api/products/live error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch live products'
    }, { status: 500 });
  }
}