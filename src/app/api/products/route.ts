import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    let query = 'SELECT * FROM Products';
    const conditions = [];
    const params: unknown[] = [];
    
    // Filter by status if provided
    if (status && ['Draft', 'Published', 'Archived'].includes(status)) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    // Filter deleted unless explicitly included
    if (!includeDeleted) {
      conditions.push('is_deleted = FALSE');
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await executeQuery(query, params);
    
    return NextResponse.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_name, product_desc, status = 'Draft', created_by } = body;
    
    // Validation
    if (!product_name || !created_by) {
      return NextResponse.json({
        success: false,
        error: 'Product name and created_by are required'
      }, { status: 400 });
    }
    
    if (status && !['Draft', 'Published', 'Archived'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Status must be one of: Draft, Published, Archived'
      }, { status: 400 });
    }
    
    const [result] = await executeQuery(
      'INSERT INTO Products (product_name, product_desc, status, created_by) VALUES (?, ?, ?, ?)',
      [product_name, product_desc, status, created_by]
    );
    
    // Get the created product
    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await executeQuery(
      'SELECT * FROM Products WHERE product_id = ?',
      [insertId]
    );
    
    return NextResponse.json({
      success: true,
      data: (rows as Record<string, unknown>[])[0],
      message: 'Product created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 });
  }
}