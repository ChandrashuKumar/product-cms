import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }
    
    
    const [rows] = await executeQuery(
      'SELECT * FROM Products WHERE product_id = ? AND is_deleted = FALSE',
      [productId]
    );
    
    const products = rows as Record<string, unknown>[];
    
    if (products.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: products[0]
    });
    
  } catch (error) {
    console.error(`GET /api/products/${id} error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }
    
    const body = await request.json();
    const { product_name, product_desc, status, updated_by } = body;
    
    // Validation
    if (!updated_by) {
      return NextResponse.json({
        success: false,
        error: 'updated_by is required'
      }, { status: 400 });
    }
    
    if (status && !['Draft', 'Published', 'Archived'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Status must be one of: Draft, Published, Archived'
      }, { status: 400 });
    }
    
    
    // Check if product exists and is not deleted
    const [existingRows] = await executeQuery(
      'SELECT * FROM Products WHERE product_id = ? AND is_deleted = FALSE',
      [productId]
    );
    
    if ((existingRows as Record<string, unknown>[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }
    
    // Build dynamic update query
    const updateFields = [];
    const params = [];
    
    if (product_name !== undefined) {
      updateFields.push('product_name = ?');
      params.push(product_name);
    }
    
    if (product_desc !== undefined) {
      updateFields.push('product_desc = ?');
      params.push(product_desc);
    }
    
    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status);
    }
    
    updateFields.push('updated_by = ?');
    params.push(updated_by);
    
    params.push(productId);
    
    const updateQuery = `UPDATE Products SET ${updateFields.join(', ')} WHERE product_id = ?`;
    
    await executeQuery(updateQuery, params);
    
    // Get updated product
    const [updatedRows] = await executeQuery(
      'SELECT * FROM Products WHERE product_id = ?',
      [productId]
    );
    
    return NextResponse.json({
      success: true,
      data: (updatedRows as Record<string, unknown>[])[0],
      message: 'Product updated successfully'
    });
    
  } catch (error) {
    console.error(`PUT /api/products/${id} error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }
    
    const body = await request.json();
    const { updated_by } = body;
    
    if (!updated_by) {
      return NextResponse.json({
        success: false,
        error: 'updated_by is required for deletion'
      }, { status: 400 });
    }
    
    
    // Check if product exists and is not already deleted
    const [existingRows] = await executeQuery(
      'SELECT * FROM Products WHERE product_id = ? AND is_deleted = FALSE',
      [productId]
    );
    
    if ((existingRows as Record<string, unknown>[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }
    
    // Soft delete
    await executeQuery(
      'UPDATE Products SET is_deleted = TRUE, updated_by = ? WHERE product_id = ?',
      [updated_by, productId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error(`DELETE /api/products/${id} error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
}