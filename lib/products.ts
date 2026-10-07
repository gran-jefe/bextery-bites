import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  badge: string;
  description: string;
  price: number;
  priceNote: string;
  category: 'bestseller' | 'clinical';
  image?: string;
  flavorOptions?: string[];
  gradient: string;
  isAvailable: boolean;
  featured?: boolean;
  updatedAt?: string;
}

export type ProductInput = Omit<Product, 'id' | 'updatedAt'> & {
  id?: string;
};

// Path to data file
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'products.json');

// In-memory cache for fast reads and runtime durability
let inMemoryProductsCache: Product[] | null = null;

// Default fallback seed in case file reading fails
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'foil-cake',
    name: 'Gourmet Foil Cake',
    badge: 'Campus & Office Favorite',
    description: 'Freshly baked single or sharing sponge in a sealed foil pan. Incredibly moist, stays fresh, and travel-safe across Ibadan.',
    price: 3500,
    priceNote: 'From ₦3,500',
    category: 'bestseller',
    image: '',
    flavorOptions: ['Rich Chocolate Fudge', 'Classic Red Velvet', 'Vanilla Bean Swirl', 'Cookies & Cream'],
    gradient: 'from-[#BD4935] to-[#9A684D]',
    isAvailable: true,
    featured: true,
  },
  {
    id: 'red-velvet',
    name: 'Signature Moist Red Velvet',
    badge: '#1 Crowd Favorite',
    description: 'Our legendary deep red crumb balanced with real buttermilk and topped with silky, tangy cream cheese frosting.',
    price: 8000,
    priceNote: 'From ₦8,000 (Bento) / ₦22,000 (8-inch)',
    category: 'bestseller',
    image: '',
    flavorOptions: ['Classic Cream Cheese', 'Whipped Vanilla Buttercream', 'Red Velvet Fudge'],
    gradient: 'from-[#9A684D] to-[#BD4935]',
    isAvailable: true,
    featured: true,
  },
  {
    id: 'chocolate-fudge',
    name: 'Decadent Fudgy Chocolate',
    badge: 'Pure Indulgence',
    description: 'Rich dark cocoa sponge infused with coffee notes for maximum chocolate depth. Soft, velvety, and deeply satisfying.',
    price: 8000,
    priceNote: 'From ₦8,000 (Bento) / ₦22,000 (8-inch)',
    category: 'bestseller',
    image: '',
    flavorOptions: ['Dark Chocolate Ganache', 'Nutella Swirl', 'Salted Caramel Drizzle'],
    gradient: 'from-[#4F4140] to-[#9A684D]',
    isAvailable: true,
    featured: false,
  },
  {
    id: 'parfait',
    name: 'Layered Greek Yogurt Parfait',
    badge: '100% Zero Food-Waste',
    description: 'Creamy artisan Greek yogurt layered with house-toasted granola, fruit coulis, and moist Bextery cake crumbs.',
    price: 2500,
    priceNote: 'From ₦2,500 (Cup) / ₦4,500 (Jumbo)',
    category: 'bestseller',
    image: '',
    flavorOptions: ['Strawberry Coulis & Red Velvet', 'Mango-Passionfruit & Vanilla', 'Blueberry Crunch'],
    gradient: 'from-[#BD4935] to-[#D0B7B2]',
    isAvailable: true,
    featured: true,
  },
  {
    id: 'celebration-bespoke',
    name: 'Custom Celebration Cake',
    badge: 'Milestones & Events',
    description: 'Multi-layer birthday, anniversary, and graduation cakes designed with precision, bespoke toppers, and clean finishes.',
    price: 25000,
    priceNote: 'Custom quote based on tiers',
    category: 'bestseller',
    image: '',
    flavorOptions: ['Red Velvet + Chocolate Duo', 'Vanilla Caramel', 'Fruit & Cream'],
    gradient: 'from-[#D0B7B2] to-[#4F4140]',
    isAvailable: true,
    featured: false,
  },
  {
    id: 'donuts-pastries',
    name: 'Glazed Donuts & Pastry Box',
    badge: 'Snack & Share',
    description: 'Soft, airy brioche-style donuts and curated snack boxes. Handcrafted in limited daily batches for optimal fluffiness.',
    price: 6000,
    priceNote: 'Box of 4 / Box of 6',
    category: 'bestseller',
    image: '',
    flavorOptions: ['Classic Glaze', 'Chocolate Dip', 'Cinnamon Sugar'],
    gradient: 'from-[#9A684D] to-[#4F4140]',
    isAvailable: true,
    featured: false,
  },
  {
    id: 'diabetic-sponge',
    name: 'Diabetic-Friendly Low-GI Sponge',
    badge: 'Clinical Formulation (Rx)',
    description: 'Formulated specifically for diabetics and elders. Zero refined sugar, sweetened with pure erythritol/monk fruit, low glycemic load.',
    price: 12000,
    priceNote: 'Formulated to order',
    category: 'clinical',
    image: '',
    flavorOptions: ['Almond Vanilla Bean', 'Pure Cocoa Fudge (Sugar-Free)', 'Spiced Cinnamon'],
    gradient: 'from-emerald-800 to-teal-950',
    isAvailable: true,
    featured: true,
  },
  {
    id: 'oat-tigernut-bread',
    name: 'High-Fiber Oat & Tigernut Loaf',
    badge: 'Indigenous Agro-Grain',
    description: 'Nutrient-packed artisanal loaf combining local tigernut (aya) natural prebiotic sweetness with rolled oat fiber. Heart-healthy and filling.',
    price: 4500,
    priceNote: 'Weekly batch bake',
    category: 'clinical',
    image: '',
    flavorOptions: ['Classic Oat & Tigernut', 'Golden Honey & Seed Blend'],
    gradient: 'from-amber-800 to-stone-900',
    isAvailable: true,
    featured: false,
  },
  {
    id: 'gluten-allergen-safe',
    name: 'Gluten-Safe / Celiac Pastry Box',
    badge: 'Allergen Conscious',
    description: 'Baked in a dedicated allergen-conscious cycle for customers with gluten sensitivities, PCOS, or celiac requirements.',
    price: 15000,
    priceNote: 'Custom dietary consult',
    category: 'clinical',
    image: '',
    flavorOptions: ['Almond Flour Muffins', 'Coconut Flour Brownies'],
    gradient: 'from-teal-900 to-stone-900',
    isAvailable: true,
    featured: false,
  },
];

/**
 * Retrieve all products from data storage with cache fallback
 */
export async function getProducts(): Promise<Product[]> {
  if (inMemoryProductsCache) {
    return inMemoryProductsCache;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryProductsCache = parsed;
        return inMemoryProductsCache;
      }
    }
  } catch (error) {
    console.warn('[Products] Unable to read products from disk, falling back to memory/defaults:', error);
  }

  inMemoryProductsCache = DEFAULT_PRODUCTS;
  return inMemoryProductsCache;
}

/**
 * Find single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.id === id) || null;
}

/**
 * Save products collection to memory and persistent disk
 */
export async function saveProducts(products: Product[]): Promise<boolean> {
  inMemoryProductsCache = products;

  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.warn('[Products] Note: Could not write products to file system (serverless environment):', error);
    // In-memory update still succeeds
    return true;
  }
}

/**
 * Create a new product
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await getProducts();
  
  const slug = (input.id || input.name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `item-${Date.now()}`;

  // Ensure unique ID
  let uniqueId = slug;
  let counter = 1;
  while (products.some((p) => p.id === uniqueId)) {
    uniqueId = `${slug}-${counter++}`;
  }

  const newProduct: Product = {
    ...input,
    id: uniqueId,
    image: input.image || '',
    flavorOptions: input.flavorOptions || [],
    gradient: input.gradient || (input.category === 'clinical' ? 'from-emerald-800 to-teal-950' : 'from-[#BD4935] to-[#9A684D]'),
    isAvailable: input.isAvailable !== false,
    updatedAt: new Date().toISOString(),
  };

  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

/**
 * Update an existing product by ID
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  const updated: Product = {
    ...products[index],
    ...updates,
    id, // Ensure ID does not change
    updatedAt: new Date().toISOString(),
  };

  products[index] = updated;
  await saveProducts(products);
  return updated;
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return false;
  }

  await saveProducts(filtered);
  return true;
}
