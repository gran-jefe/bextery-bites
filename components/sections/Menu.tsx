'use client';

import { useState, useEffect } from 'react';
import { Sparkles, HeartPulse, Check, ArrowRight, ShoppingCart, AlertCircle } from 'lucide-react';
import { Product } from '@/lib/products';

const defaultSeedProducts: Product[] = [
  // Wing A: Current Bestsellers
  {
    id: 'foil-cake',
    name: 'Gourmet Foil Cake',
    badge: 'Campus & Office Favorite',
    description: 'Freshly baked single or sharing sponge in a sealed foil pan. Incredibly moist, stays fresh, and travel-safe across Ibadan.',
    price: 3500,
    priceNote: 'From ₦3,500',
    category: 'bestseller',
    flavorOptions: ['Rich Chocolate Fudge', 'Classic Red Velvet', 'Vanilla Bean Swirl', 'Cookies & Cream'],
    gradient: 'from-[#BD4935] to-[#9A684D]',
    isAvailable: true,
  },
  {
    id: 'red-velvet',
    name: 'Signature Moist Red Velvet',
    badge: '#1 Crowd Favorite',
    description: 'Our legendary deep red crumb balanced with real buttermilk and topped with silky, tangy cream cheese frosting.',
    price: 8000,
    priceNote: 'From ₦8,000 (Bento) / ₦22,000 (8-inch)',
    category: 'bestseller',
    flavorOptions: ['Classic Cream Cheese', 'Whipped Vanilla Buttercream', 'Red Velvet Fudge'],
    gradient: 'from-[#9A684D] to-[#BD4935]',
    isAvailable: true,
  },
  {
    id: 'chocolate-fudge',
    name: 'Decadent Fudgy Chocolate',
    badge: 'Pure Indulgence',
    description: 'Rich dark cocoa sponge infused with coffee notes for maximum chocolate depth. Soft, velvety, and deeply satisfying.',
    price: 8000,
    priceNote: 'From ₦8,000 (Bento) / ₦22,000 (8-inch)',
    category: 'bestseller',
    flavorOptions: ['Dark Chocolate Ganache', 'Nutella Swirl', 'Salted Caramel Drizzle'],
    gradient: 'from-[#4F4140] to-[#9A684D]',
    isAvailable: true,
  },
  {
    id: 'parfait',
    name: 'Layered Greek Yogurt Parfait',
    badge: '100% Zero Food-Waste',
    description: 'Creamy artisan Greek yogurt layered with house-toasted granola, fruit coulis, and moist Bextery cake crumbs.',
    price: 2500,
    priceNote: 'From ₦2,500 (Cup) / ₦4,500 (Jumbo)',
    category: 'bestseller',
    flavorOptions: ['Strawberry Coulis & Red Velvet', 'Mango-Passionfruit & Vanilla', 'Blueberry Crunch'],
    gradient: 'from-[#BD4935] to-[#D0B7B2]',
    isAvailable: true,
  },
  {
    id: 'celebration-bespoke',
    name: 'Custom Celebration Cake',
    badge: 'Milestones & Events',
    description: 'Multi-layer birthday, anniversary, and graduation cakes designed with precision, bespoke toppers, and clean finishes.',
    price: 25000,
    priceNote: 'Custom quote based on tiers',
    category: 'bestseller',
    flavorOptions: ['Red Velvet + Chocolate Duo', 'Vanilla Caramel', 'Fruit & Cream'],
    gradient: 'from-[#D0B7B2] to-[#4F4140]',
    isAvailable: true,
  },
  {
    id: 'donuts-pastries',
    name: 'Glazed Donuts & Pastry Box',
    badge: 'Snack & Share',
    description: 'Soft, airy brioche-style donuts and curated snack boxes. Handcrafted in limited daily batches for optimal fluffiness.',
    price: 6000,
    priceNote: 'Box of 4 / Box of 6',
    category: 'bestseller',
    flavorOptions: ['Classic Glaze', 'Chocolate Dip', 'Cinnamon Sugar'],
    gradient: 'from-[#9A684D] to-[#4F4140]',
    isAvailable: true,
  },

  // Wing B: Clinical & Therapeutic Nutrition Line
  {
    id: 'diabetic-sponge',
    name: 'Diabetic-Friendly Low-GI Sponge',
    badge: 'Clinical Formulation (Rx)',
    description: 'Formulated specifically for diabetics and elders. Zero refined sugar, sweetened with pure erythritol/monk fruit, low glycemic load.',
    price: 12000,
    priceNote: 'Formulated to order',
    category: 'clinical',
    flavorOptions: ['Almond Vanilla Bean', 'Pure Cocoa Fudge (Sugar-Free)', 'Spiced Cinnamon'],
    gradient: 'from-emerald-800 to-teal-950',
    isAvailable: true,
  },
  {
    id: 'oat-tigernut-bread',
    name: 'High-Fiber Oat & Tigernut Loaf',
    badge: 'Indigenous Agro-Grain',
    description: 'Nutrient-packed artisanal loaf combining local tigernut (aya) natural prebiotic sweetness with rolled oat fiber. Heart-healthy and filling.',
    price: 4500,
    priceNote: 'Weekly batch bake',
    category: 'clinical',
    flavorOptions: ['Classic Oat & Tigernut', 'Golden Honey & Seed Blend'],
    gradient: 'from-amber-800 to-stone-900',
    isAvailable: true,
  },
  {
    id: 'gluten-allergen-safe',
    name: 'Gluten-Safe / Celiac Pastry Box',
    badge: 'Allergen Conscious',
    description: 'Baked in a dedicated allergen-conscious cycle for customers with gluten sensitivities, PCOS, or celiac requirements.',
    price: 15000,
    priceNote: 'Custom dietary consult',
    category: 'clinical',
    flavorOptions: ['Almond Flour Muffins', 'Coconut Flour Brownies'],
    gradient: 'from-teal-900 to-stone-900',
    isAvailable: true,
  },
];

export default function Menu() {
  const [productList, setProductList] = useState<Product[]>(defaultSeedProducts);
  const [activeTab, setActiveTab] = useState<'bestseller' | 'clinical'>('bestseller');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [deliveryArea, setDeliveryArea] = useState<string>('Bodija');
  const [customerNote, setCustomerNote] = useState<string>('');

  // Fetch live updated products from API
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductList(data.products);
        }
      } catch (err) {
        console.warn('Using seeded catalog products:', err);
      }
    }
    loadLiveProducts();
  }, []);

  const filteredProducts = productList.filter((p) => p.category === activeTab);

  const handleSelectProduct = (product: Product) => {
    if (!product.isAvailable) return;
    setSelectedProduct(product);
    setSelectedFlavor(product.flavorOptions && product.flavorOptions.length > 0 ? product.flavorOptions[0] : '');
  };

  const generateWhatsAppUrl = () => {
    if (!selectedProduct) return 'https://wa.me/2347067436817';

    const message = `Hello Bextery Bites! 🍰
I would like to order:
• Item: ${selectedProduct.name}
• Category: ${selectedProduct.category === 'clinical' ? 'Clinical / Therapeutic Diet' : 'Indulgence Bestseller'}
• Selected Flavor/Type: ${selectedFlavor || 'Standard'}
• Delivery Area in Ibadan: ${deliveryArea}
${customerNote ? `• Special Request / Note: ${customerNote}` : ''}

Please confirm availability and the invoice details. Thank you!`;

    return `https://wa.me/2347067436817?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-brand-brown font-body text-xs font-semibold tracking-widest uppercase mb-3">
            Crafted With Scientific Dexterity
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-dark mb-4">
            Our Two-Wing Menu
          </h2>
          {/* Brand double line accent */}
          <div className="w-24 mx-auto space-y-1 my-4 opacity-75">
            <div className="h-0.5 w-full bg-brand-red" />
            <div className="h-0.5 w-full bg-brand-red" />
          </div>
          <p className="text-base sm:text-lg text-brand-brown font-body max-w-2xl mx-auto">
            Choose between our daily indulgence bestsellers and our dietitian-led clinical therapeutic line.
          </p>

          {/* Tab Selector */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-white shadow-soft border border-brand-rose/30">
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'bestseller'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-brand-dark hover:text-brand-red'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Current Bestsellers (Order Now)
            </button>

            <button
              onClick={() => setActiveTab('clinical')}
              id="clinical"
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'clinical'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-brand-dark hover:text-emerald-800'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-emerald-300" />
              Clinical & Therapeutic Diets
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-soft overflow-hidden border border-brand-rose/20 flex flex-col justify-between hover:shadow-warm transition-all duration-300 group"
            >
              <div>
                {/* Visual Header */}
                <div
                  className={`w-full h-48 p-5 flex flex-col justify-between text-white relative overflow-hidden ${
                    !product.image ? `bg-gradient-to-br ${product.gradient}` : 'bg-gray-900'
                  }`}
                >
                  {product.image && (
                    <div className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />
                    </div>
                  )}

                  <div className="flex justify-between items-start relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                      {product.badge}
                    </span>
                    <span className="text-xs font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/10">
                      {product.priceNote}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-display font-bold leading-tight drop-shadow-xs">
                      {product.name}
                    </h3>
                    {!product.isAvailable && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-red-600/90 text-white px-2.5 py-0.5 rounded-md shadow-xs">
                        Sold Out For Today
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <p className="text-brand-brown font-body text-xs sm:text-sm leading-relaxed">
                    {product.description}
                  </p>

                  {product.flavorOptions && (
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-semibold text-brand-dark uppercase tracking-wider">
                        Available Flavors / Formulations:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.flavorOptions.map((flavor) => (
                          <span
                            key={flavor}
                            className="text-[11px] bg-brand-cream text-brand-dark px-2.5 py-1 rounded-md border border-brand-rose/30"
                          >
                            {flavor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-6 pt-0">
                <button
                  disabled={!product.isAvailable}
                  onClick={() => handleSelectProduct(product)}
                  className={`w-full py-3.5 px-4 rounded-xl font-body font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    !product.isAvailable
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : product.category === 'clinical'
                      ? 'bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer shadow-xs'
                      : 'bg-brand-red text-white hover:bg-brand-brown cursor-pointer shadow-xs'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.isAvailable ? 'Customize & Order' : 'Temporarily Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive WhatsApp Order Builder Drawer / Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-rose/30 animate-fade-in-scale">
              <div className="flex justify-between items-start border-b border-brand-rose/20 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-brand-red uppercase tracking-wider">
                    Instant WhatsApp Order Builder
                  </span>
                  <h3 className="text-2xl font-display font-bold text-brand-dark">
                    {selectedProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-brand-brown hover:text-brand-dark text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Flavor Selector */}
              {selectedProduct.flavorOptions && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
                    Select Flavor / Variant:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedProduct.flavorOptions.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFlavor(f)}
                        className={`text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                          selectedFlavor === f
                            ? 'border-brand-red bg-brand-red/5 text-brand-red'
                            : 'border-brand-rose/30 text-brand-dark hover:bg-brand-cream'
                        }`}
                      >
                        <span>{f}</span>
                        {selectedFlavor === f && <Check className="w-4 h-4 text-brand-red" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery District Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
                  Delivery District in Ibadan:
                </label>
                <select
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-rose/40 text-xs font-semibold text-brand-dark bg-brand-cream/50 focus:outline-brand-red"
                >
                  <option value="Bodija / UI / Agbowo">Bodija / UI / Agbowo</option>
                  <option value="Oluyole Estate / Ring Road">Oluyole Estate / Ring Road</option>
                  <option value="Akobo / General Gas">Akobo / General Gas</option>
                  <option value="Jericho / Onireke / Dugbe">Jericho / Onireke / Dugbe</option>
                  <option value="Samonda / Sango / Mokola">Samonda / Sango / Mokola</option>
                  <option value="Ikolaba / Secretariat">Ikolaba / Secretariat</option>
                  <option value="Other Ibadan Area">Other Ibadan Area (Specify in chat)</option>
                </select>
              </div>

              {/* Special Note */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
                  Writing on Cake / Dietary Notes / Quantity:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Happy 25th Birthday Tolu! Or diabetic request..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-rose/40 text-xs text-brand-dark bg-white focus:outline-brand-red"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3.5 rounded-xl border border-brand-rose/40 text-xs font-semibold text-brand-brown hover:bg-brand-cream transition-colors"
                >
                  Cancel
                </button>
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-2 py-3.5 rounded-xl bg-brand-red text-white text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-brand-brown transition-colors shadow-md"
                >
                  Send Order to WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
