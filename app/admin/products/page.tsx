'use client';

import React, { useState, useEffect, useId } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  HeartPulse,
  Save,
  X,
  AlertCircle,
  Loader2,
  Tag,
  DollarSign,
  Layers,
  Check,
  Eye,
} from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';
import { Product } from '@/lib/products';

const GRADIENT_PRESETS = [
  { label: 'Red & Brown (Brand Signature)', value: 'from-[#BD4935] to-[#9A684D]' },
  { label: 'Brown & Red (Warm Velvet)', value: 'from-[#9A684D] to-[#BD4935]' },
  { label: 'Espresso & Brown (Dark Chocolate)', value: 'from-[#4F4140] to-[#9A684D]' },
  { label: 'Red & Rose (Parfait Blush)', value: 'from-[#BD4935] to-[#D0B7B2]' },
  { label: 'Rose & Espresso (Celebration)', value: 'from-[#D0B7B2] to-[#4F4140]' },
  { label: 'Brown & Espresso (Pastry Box)', value: 'from-[#9A684D] to-[#4F4140]' },
  { label: 'Emerald & Teal (Clinical Rx)', value: 'from-emerald-800 to-teal-950' },
  { label: 'Amber & Stone (Agro-Grain)', value: 'from-amber-800 to-stone-900' },
  { label: 'Teal & Stone (Gluten Safe)', value: 'from-teal-900 to-stone-900' },
];

export default function AdminProductsPage() {
  const fileInputId = useId();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'bestseller' | 'clinical'>('all');

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Flavor Tag input state
  const [newFlavorInput, setNewFlavorInput] = useState('');

  // Delete confirmation modal state
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products from admin API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Open modal for Create
  const handleAddNew = () => {
    setEditingProduct({
      id: '',
      name: '',
      badge: 'New Item',
      description: '',
      price: 3500,
      priceNote: 'From ₦3,500',
      category: 'bestseller',
      image: '',
      flavorOptions: ['Classic'],
      gradient: 'from-[#BD4935] to-[#9A684D]',
      isAvailable: true,
      featured: false,
    });
    setNewFlavorInput('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setNewFlavorInput('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  // Toggle in-stock / sold-out status directly
  const handleToggleAvailability = async (product: Product) => {
    try {
      const newStatus = !product.isAvailable;
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          isAvailable: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isAvailable: newStatus } : p))
        );
        showToast(
          `${product.name} marked as ${newStatus ? 'In Stock' : 'Sold Out'}`
        );
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  // Handle client-side image compression and upload to Data URL
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      // Compress via HTML Canvas to maintain fast loading and avoid huge storage
      const img = document.createElement('img');
      img.src = rawDataUrl;
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/webp', 0.85);
          setEditingProduct((prev) => (prev ? { ...prev, image: compressed } : null));
        } else {
          setEditingProduct((prev) => (prev ? { ...prev, image: rawDataUrl } : null));
        }
      };
    };
    reader.readAsDataURL(file);
  };

  // Add a flavor tag
  const handleAddFlavor = () => {
    if (!newFlavorInput.trim() || !editingProduct) return;
    const currentFlavors = editingProduct.flavorOptions || [];
    if (!currentFlavors.includes(newFlavorInput.trim())) {
      setEditingProduct({
        ...editingProduct,
        flavorOptions: [...currentFlavors, newFlavorInput.trim()],
      });
    }
    setNewFlavorInput('');
  };

  // Remove a flavor tag
  const handleRemoveFlavor = (flavorToRemove: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      flavorOptions: (editingProduct.flavorOptions || []).filter((f) => f !== flavorToRemove),
    });
  };

  // Save product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name?.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }

    if (!editingProduct.priceNote?.trim()) {
      setErrorMessage('Display price is required (e.g. From ₦3,500).');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const isNew = !editingProduct.id;
      const endpoint = '/api/admin/products';
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();

      if (data.success) {
        showToast(
          isNew
            ? `Added "${editingProduct.name}" to store products!`
            : `Updated "${editingProduct.name}" successfully!`
        );
        setIsModalOpen(false);
        fetchProducts();
      } else {
        setErrorMessage(data.error || 'Failed to save product.');
      }
    } catch {
      setErrorMessage('Network error while saving product.');
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm and delete product
  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/products?id=${deletingProductId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deletingProductId));
        showToast('Product removed from store.');
        setDeletingProductId(null);
      } else {
        alert(data.error || 'Failed to delete product.');
      }
    } catch {
      alert('Network error while deleting product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badge?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const bestsellersCount = products.filter((p) => p.category === 'bestseller').length;
  const clinicalCount = products.filter((p) => p.category === 'clinical').length;
  const inStockCount = products.filter((p) => p.isAvailable).length;

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#4F4140] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
          </div>
        )}

        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#D0B7B2]/40 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#BD4935]/10 text-[#BD4935]">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#4F4140]">
                Storefront Products
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#9A684D] mt-1">
              Add, update, and manage your cakes, parfaits, clinical loaves, images, and live prices.
            </p>
          </div>

          <button
            onClick={handleAddNew}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#BD4935] hover:bg-[#a63e2c] text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#D0B7B2]/40 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">Total Products</span>
            <div className="text-2xl font-bold text-[#4F4140] mt-0.5">{products.length}</div>
            <span className="text-[11px] text-[#BD4935] font-semibold">Live in Catalog</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#D0B7B2]/40 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">In Stock</span>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">{inStockCount}</div>
            <span className="text-[11px] text-gray-500">Available to order</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#D0B7B2]/40 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">Bestsellers Wing</span>
            <div className="text-2xl font-bold text-[#BD4935] mt-0.5">{bestsellersCount}</div>
            <span className="text-[11px] text-gray-500">Daily Indulgence</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#D0B7B2]/40 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">Clinical / Diet Wing</span>
            <div className="text-2xl font-bold text-emerald-800 mt-0.5">{clinicalCount}</div>
            <span className="text-[11px] text-gray-500">Therapeutic Line</span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#D0B7B2]/40 shadow-2xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF3F1] rounded-xl border border-[#D0B7B2]/50 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-[#BD4935] text-white shadow-xs'
                  : 'text-[#4F4140] hover:bg-white/60'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setCategoryFilter('bestseller')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'bestseller'
                  ? 'bg-[#BD4935] text-white shadow-xs'
                  : 'text-[#4F4140] hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Bestsellers ({bestsellersCount})
            </button>
            <button
              onClick={() => setCategoryFilter('clinical')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'clinical'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-[#4F4140] hover:bg-white/60'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
              Clinical Diets ({clinicalCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-[#D0B7B2]/60 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#BD4935]/30 bg-white"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#BD4935] mb-2" />
            <p className="text-xs text-[#9A684D] font-medium">Loading catalog products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#D0B7B2]/40">
            <ShoppingBag className="w-12 h-12 mx-auto text-[#D0B7B2] mb-3" />
            <h3 className="text-base font-bold text-[#4F4140]">No products found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              No products match your search or filter. Try a different query or add a new product.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#D0B7B2]/40 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-soft transition-all"
              >
                <div>
                  {/* Card Header (Product Image or Gradient) */}
                  <div
                    className={`w-full h-44 relative overflow-hidden flex flex-col justify-between p-4 ${
                      !product.image ? `bg-gradient-to-br ${product.gradient}` : 'bg-gray-100'
                    }`}
                  >
                    {product.image && (
                      <div className="absolute inset-0">
                        {/* Next.js Image or raw img */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 relative z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-xs text-white px-2.5 py-1 rounded-full border border-white/20">
                        {product.badge}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          product.isAvailable
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                        }`}
                      >
                        {product.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5" /> In Stock
                          </>
                        ) : (
                          <>
                            <XCircle className="w-2.5 h-2.5" /> Sold Out
                          </>
                        )}
                      </span>
                    </div>

                    {/* Title & Price overlay */}
                    <div className="relative z-10 text-white">
                      <h3 className="font-display font-bold text-xl leading-tight drop-shadow-xs">
                        {product.name}
                      </h3>
                      <div className="text-xs font-semibold text-white/90 mt-0.5 drop-shadow-xs">
                        {product.priceNote}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-[#9A684D] leading-relaxed line-clamp-3">
                      {product.description}
                    </p>

                    {/* Category pill */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          product.category === 'clinical'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-[#BD4935]/10 text-[#BD4935] border border-[#BD4935]/20'
                        }`}
                      >
                        {product.category === 'clinical' ? 'Clinical / Diet' : 'Indulgence Bestseller'}
                      </span>
                    </div>

                    {/* Flavors */}
                    {product.flavorOptions && product.flavorOptions.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                          Flavors ({product.flavorOptions.length}):
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.flavorOptions.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-[10px] bg-[#FAF3F1] text-[#4F4140] px-2 py-0.5 rounded-md border border-[#D0B7B2]/40"
                            >
                              {f}
                            </span>
                          ))}
                          {product.flavorOptions.length > 3 && (
                            <span className="text-[10px] text-gray-400 font-medium self-center">
                              +{product.flavorOptions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between gap-2">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => handleToggleAvailability(product)}
                    className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                      product.isAvailable
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
                    }`}
                    title="Toggle stock availability"
                  >
                    {product.isAvailable ? (
                      <>
                        <Check className="w-3 h-3" /> In Stock
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> Mark In Stock
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-[#BD4935] bg-[#BD4935]/10 hover:bg-[#BD4935]/20 rounded-xl font-semibold transition cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeletingProductId(product.id)}
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-semibold transition cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT PRODUCT MODAL */}
        {isModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D0B7B2]/40 relative my-8 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-[#4F4140]">
                    {editingProduct.id ? `Edit "${editingProduct.name}"` : 'Add New Product'}
                  </h3>
                  <p className="text-xs text-[#9A684D]">
                    Configure storefront presentation, image, price, and flavors
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-5">
                {/* Product Name & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      placeholder="e.g. Gourmet Foil Cake"
                      required
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                      Badge / Tagline Pill
                    </label>
                    <input
                      type="text"
                      value={editingProduct.badge || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, badge: e.target.value })
                      }
                      placeholder="e.g. Campus & Office Favorite"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Category & Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                      Storefront Category *
                    </label>
                    <select
                      value={editingProduct.category || 'bestseller'}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value as 'bestseller' | 'clinical',
                        })
                      }
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden bg-white"
                    >
                      <option value="bestseller">Wing A: Current Bestsellers (Indulgence)</option>
                      <option value="clinical">Wing B: Clinical & Therapeutic Nutrition Line</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                      Availability Status
                    </label>
                    <div className="flex items-center gap-3 pt-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={editingProduct.isAvailable !== false}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isAvailable: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-[#BD4935] rounded-sm focus:ring-[#BD4935]"
                        />
                        <span className={editingProduct.isAvailable ? 'text-emerald-700' : 'text-gray-500'}>
                          {editingProduct.isAvailable ? '✓ In Stock (Can be ordered)' : '✕ Sold Out'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Price Note & Numeric Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                      Display Price Note *
                    </label>
                    <input
                      type="text"
                      value={editingProduct.priceNote || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, priceNote: e.target.value })
                      }
                      placeholder="e.g. From ₦3,500 or ₦8,000 (Bento)"
                      required
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-gray-500">Customer-facing price text</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                      Base Price (NGN)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value) || 0,
                        })
                      }
                      placeholder="3500"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-gray-500">Numeric base calculation</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    placeholder="Describe the texture, ingredients, and taste..."
                    className="w-full text-xs sm:text-sm p-3 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
                  />
                </div>

                {/* PRODUCT IMAGE SECTION */}
                <div className="p-4 bg-[#FAF3F1]/60 rounded-2xl border border-[#D0B7B2]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#4F4140] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#BD4935]" />
                      Product Image (Photo or Cover)
                    </label>
                    {editingProduct.image && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({ ...editingProduct, image: '' })
                        }
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Live Preview Box */}
                    <div className="sm:col-span-4">
                      <div className="w-full h-28 rounded-xl border border-dashed border-[#D0B7B2] bg-white overflow-hidden relative flex items-center justify-center">
                        {editingProduct.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={editingProduct.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${editingProduct.gradient || 'from-[#BD4935] to-[#9A684D]'} flex items-center justify-center text-white text-[10px] font-semibold text-center p-2`}
                          >
                            <span>Fallback Gradient Theme Active</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Controls */}
                    <div className="sm:col-span-8 space-y-2">
                      <div>
                        <label
                          htmlFor={fileInputId}
                          className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-[#BD4935] text-white rounded-xl text-xs font-semibold hover:bg-[#a63e2c] transition shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image from Device</span>
                        </label>
                        <input
                          id={fileInputId}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] text-gray-500 block mb-1">
                          Or enter public image URL:
                        </span>
                        <input
                          type="text"
                          value={editingProduct.image || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, image: e.target.value })
                          }
                          placeholder="https://example.com/cake.jpg or /brand-sticker-round.png"
                          className="w-full text-xs px-3 py-1.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fallback Gradient Presets */}
                <div>
                  <label className="block text-xs font-semibold text-[#4F4140] mb-1.5">
                    Fallback Card Gradient (Used if no image is uploaded)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() =>
                          setEditingProduct({ ...editingProduct, gradient: preset.value })
                        }
                        className={`h-9 rounded-xl border flex items-center justify-between px-2 text-[10px] font-medium transition cursor-pointer ${
                          editingProduct.gradient === preset.value
                            ? 'border-2 border-[#BD4935] ring-2 ring-[#BD4935]/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md bg-gradient-to-br ${preset.value} shadow-xs shrink-0`}
                        />
                        <span className="truncate text-gray-700 ml-1 text-[9px]">
                          {preset.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flavor Options Tag Manager */}
                <div>
                  <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                    Available Flavors / Formulations
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2 p-2 min-h-11 bg-gray-50 rounded-xl border border-gray-200">
                    {(!editingProduct.flavorOptions ||
                      editingProduct.flavorOptions.length === 0) && (
                      <span className="text-xs text-gray-400 italic">No flavors added yet</span>
                    )}
                    {editingProduct.flavorOptions?.map((flavor) => (
                      <span
                        key={flavor}
                        className="inline-flex items-center gap-1 text-xs bg-white text-[#4F4140] px-2.5 py-1 rounded-lg border border-[#D0B7B2]/60 shadow-2xs"
                      >
                        <span>{flavor}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFlavor(flavor)}
                          className="text-gray-400 hover:text-red-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFlavorInput}
                      onChange={(e) => setNewFlavorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFlavor();
                        }
                      }}
                      placeholder="Type flavor name (e.g. Vanilla Bean, Red Velvet Fudge)..."
                      className="flex-1 text-xs px-3 py-2 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddFlavor}
                      className="px-3.5 py-2 bg-[#BD4935] text-white text-xs font-semibold rounded-xl hover:bg-[#a63e2c] transition"
                    >
                      Add Flavor
                    </button>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#BD4935] hover:bg-[#a63e2c] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingProductId && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-[#D0B7B2]/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#4F4140]">
                Delete this product?
              </h3>
              <p className="text-xs text-gray-500">
                This item will be permanently removed from your live store catalog.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingProductId(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={isDeleting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
