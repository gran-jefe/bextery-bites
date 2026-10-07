import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const all = await getProducts();
    const filtered = category ? all.filter((p) => p.category === category) : all;

    return NextResponse.json({
      success: true,
      products: filtered,
    });
  } catch (error) {
    console.error('[Public Products API] Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}
