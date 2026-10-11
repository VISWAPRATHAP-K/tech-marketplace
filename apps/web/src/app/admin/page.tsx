'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Product, Booking, Enquiry, StoreStats, Category } from '../../types';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  LayoutDashboard,
  Package,
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Check,
  Cpu,
  Layers,
  DollarSign,
  TrendingUp,
  Store as StoreIcon,
  X,
} from 'lucide-react';

export default function StoreAdminPage() {
  const currentStoreId = 'store-1'; // Default demo store for testing!

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'bookings' | 'enquiries'>('overview');
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState('Apple');
  const [formCategory, setFormCategory] = useState('cat-1');
  const [formPrice, setFormPrice] = useState('1299');
  const [formOriginalPrice, setFormOriginalPrice] = useState('1499');
  const [formCondition, setFormCondition] = useState<'BRAND_NEW' | 'LIKE_NEW' | 'REFURBISHED' | 'USED'>('LIKE_NEW');
  const [formCpu, setFormCpu] = useState('Apple M3 Pro');
  const [formGpu, setFormGpu] = useState('18-core GPU');
  const [formRam, setFormRam] = useState('18GB');
  const [formStorage, setFormStorage] = useState('512GB SSD');
  const [formWarranty, setFormWarranty] = useState('12');
  const [formBattery, setFormBattery] = useState('98');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&fit=crop');
  const [formDesc, setFormDesc] = useState('Mint condition, boxed with original charger and warranty certificate.');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, pData, bData, eData, cats] = await Promise.all([
        api.getStoreStats(currentStoreId),
        api.getProducts({ storeId: currentStoreId }),
        api.getBookings(currentStoreId),
        api.getEnquiries(currentStoreId),
        api.getCategories(),
      ]);
      setStats(sData);
      setProducts(pData);
      setBookings(bData);
      setEnquiries(eData);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProduct({
        storeId: currentStoreId,
        categoryId: formCategory,
        title: formTitle,
        brand: formBrand,
        model: formTitle,
        description: formDesc,
        price: parseFloat(formPrice),
        originalPrice: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
        condition: formCondition,
        status: 'AVAILABLE',
        warrantyMonths: parseInt(formWarranty) || 12,
        batteryHealthPct: formBattery ? parseInt(formBattery) : undefined,
        images: [formImage],
        specifications: {
          cpu: formCpu,
          gpu: formGpu,
          ram: formRam,
          storage: formStorage,
        },
      });
      setIsAddModalOpen(false);
      await loadData();
      alert('Product created and published to store successfully!');
    } catch (err) {
      alert('Failed to create product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      await api.deleteProduct(id);
      await loadData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleUpdateAvailability = async (id: string, status: 'AVAILABLE' | 'RESERVED' | 'SOLD') => {
    try {
      await api.updateProduct(id, { status });
      await loadData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await api.updateBookingStatus(id, status);
      await loadData();
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
              <StoreIcon className="w-4 h-4" />
              <span>Store Owner Portal • Apex Tech Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Merchant Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" /> Add New Tech Listing
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview & Sales
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Inventory & Specs ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> Customer Reservations ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Customer Enquiries ({enquiries.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-semibold text-slate-400 mb-1">Total Inventory Value</div>
                <div className="text-2xl font-black text-white">${stats.inventoryValue.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-400 font-medium mt-1">{stats.productsCount} items in stock</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-semibold text-slate-400 mb-1">Pending In-Store Holds</div>
                <div className="text-2xl font-black text-amber-400">{stats.pendingBookings}</div>
                <div className="text-[11px] text-slate-400 mt-1">Awaiting customer visit</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-semibold text-slate-400 mb-1">Confirmed Reservations</div>
                <div className="text-2xl font-black text-blue-400">{stats.confirmedBookings}</div>
                <div className="text-[11px] text-slate-400 mt-1">Ready for pickup</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-semibold text-slate-400 mb-1">Customer Leads & Questions</div>
                <div className="text-2xl font-black text-purple-400">{stats.enquiriesCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">Direct inquiries</div>
              </div>
            </div>

            {/* Availability Split */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Available For Sale</span>
                  <div className="text-xl font-bold text-emerald-400">{stats.availableCount} Units</div>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500/30" />
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Reserved (On Hold)</span>
                  <div className="text-xl font-bold text-amber-400">{stats.reservedCount} Units</div>
                </div>
                <Calendar className="w-8 h-8 text-amber-500/30" />
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Sold / Collected</span>
                  <div className="text-xl font-bold text-slate-300">{stats.soldCount} Units</div>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500/30" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & SPECS */}
        {activeTab === 'products' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Active Product Catalog</h3>
              <span className="text-xs text-slate-400">{products.length} Items Listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Tech Specs (CPU/GPU/RAM)</th>
                    <th className="p-4">Condition</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-950 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-white text-xs">{p.title}</div>
                            <div className="text-[11px] text-slate-400">{p.brand} • {p.warrantyMonths}m Warranty</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        <div>{p.specifications.cpu || '—'}</div>
                        <div className="text-[11px] text-slate-500">{p.specifications.gpu || '—'} • {p.specifications.ram || '—'}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                          {p.condition.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white text-sm">
                        ${p.price}
                      </td>
                      <td className="p-4">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateAvailability(p.id, e.target.value as any)}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer"
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="RESERVED">RESERVED</option>
                          <option value="SOLD">SOLD</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Customer Store Reservations</h3>
              <span className="text-xs text-slate-400">{bookings.length} Bookings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Visit Date</th>
                    <th className="p-4">Customer Notes</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Manage Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono font-bold text-blue-400">{b.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{b.customerName}</div>
                        <div className="text-slate-400 text-[11px]">{b.customerPhone}</div>
                      </td>
                      <td className="p-4 text-slate-300">
                        {new Date(b.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">
                        {b.notes || 'No special note'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : b.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                          className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[11px] font-semibold transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                          className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded text-[11px] font-semibold transition"
                        >
                          Complete (Sold)
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                          className="px-2 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded text-[11px] font-semibold transition"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6">
            <h3 className="font-bold text-sm text-white mb-4">Direct Customer Messages</h3>
            <div className="space-y-4">
              {enquiries.map((e) => (
                <div key={e.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-xs">{e.customerName}</span>
                      <span className="text-[11px] text-slate-400">• {e.customerPhone}</span>
                    </div>
                    <p className="text-xs text-slate-300">{e.message}</p>
                  </div>
                  <a
                    href={`https://wa.me/${e.customerPhone.replace(/\D/g, '')}?text=Hi ${e.customerName}! Regarding your question on OmniTech Marketplace...`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Reply on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Add New Device Listing</h3>
            <p className="text-xs text-slate-400 mb-6">Enter specifications, pricing, battery health, and warranty details.</p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. MacBook Pro 14 M3 Pro 18GB 512GB"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Apple, ASUS, Lenovo, Samsung, Sony..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Hardware Specifications */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>Hardware Specifications</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Processor (CPU)</label>
                    <input
                      type="text"
                      value={formCpu}
                      onChange={(e) => setFormCpu(e.target.value)}
                      placeholder="e.g. Intel Core i9-14900HX or M3 Max"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Graphics (GPU)</label>
                    <input
                      type="text"
                      value={formGpu}
                      onChange={(e) => setFormGpu(e.target.value)}
                      placeholder="e.g. RTX 4080 12GB"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">RAM</label>
                    <input
                      type="text"
                      value={formRam}
                      onChange={(e) => setFormRam(e.target.value)}
                      placeholder="e.g. 32GB DDR5"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Storage</label>
                    <input
                      type="text"
                      value={formStorage}
                      onChange={(e) => setFormStorage(e.target.value)}
                      placeholder="e.g. 1TB NVMe SSD"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Condition, Warranty, Battery */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Condition *</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="BRAND_NEW">Brand New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="REFURBISHED">Refurbished</option>
                    <option value="USED">Pre-Owned (Used)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    value={formWarranty}
                    onChange={(e) => setFormWarranty(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Battery Health (%)</label>
                  <input
                    type="number"
                    value={formBattery}
                    onChange={(e) => setFormBattery(e.target.value)}
                    placeholder="e.g. 96"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Photo URL *</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-600/30"
              >
                Publish Product to Store
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
