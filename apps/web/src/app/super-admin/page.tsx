'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Store, PlatformStats, Product } from '../../types';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Layers,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Building2,
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function SuperAdminPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stores' | 'listings' | 'disputes'>('stores');

  const loadData = async () => {
    setLoading(true);
    try {
      const [platformStats, allStores, allProducts] = await Promise.all([
        api.getPlatformStats(),
        api.getAllStoresForAdmin(),
        api.getProducts(),
      ]);
      setStats(platformStats);
      setStores(allStores);
      setProducts(allProducts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStoreApproval = async (storeId: string, currentStatus: boolean) => {
    try {
      await api.setStoreApproval(storeId, !currentStatus);
      await loadData();
    } catch (e) {
      alert('Failed to update store verification status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
              <Layers className="w-4 h-4" />
              <span>Platform Owner Super Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Governance</h1>
          </div>

          <button
            onClick={loadData}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* Platform KPI Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-semibold text-slate-400 mb-1">Total Stores</div>
              <div className="text-2xl font-black text-white">{stats.totalStores}</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">
                {stats.approvedStores} Approved • {stats.pendingStores} Pending
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-semibold text-slate-400 mb-1">Platform Merchandise Value</div>
              <div className="text-2xl font-black text-emerald-400">
                ${stats.totalGrossMerchandiseValue.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Live active listings value</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-semibold text-slate-400 mb-1">Total Marketplace Listings</div>
              <div className="text-2xl font-black text-blue-400">{stats.totalListings}</div>
              <div className="text-[11px] text-slate-400 mt-1">Across all vendor stores</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-semibold text-slate-400 mb-1">Total Customer Reservations</div>
              <div className="text-2xl font-black text-purple-400">{stats.totalBookings}</div>
              <div className="text-[11px] text-slate-400 mt-1">In-store visit holds</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'stores'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" /> Store Approvals & Management ({stores.length})
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Global Marketplace Listings ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'disputes'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Disputes & Safety Policy
          </button>
        </div>

        {/* TAB 1: STORE APPROVALS & MANAGEMENT */}
        {activeTab === 'stores' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-white">Registered Stores & Vendor Verification</h3>
                <p className="text-xs text-slate-400">Review business profiles, phone numbers, and grant marketplace publishing access.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Store Profile</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Verification Status</th>
                    <th className="p-4 text-right">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stores.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={s.logo} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-950 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-white text-xs">{s.name}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">{s.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        <div>{s.city}, {s.state}</div>
                        <div className="text-[11px] text-slate-500">{s.address}</div>
                      </td>
                      <td className="p-4 text-slate-300">
                        <div>Phone: {s.phone}</div>
                        <div className="text-[11px] text-emerald-400">WA: {s.whatsapp}</div>
                      </td>
                      <td className="p-4">
                        {s.isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck className="w-3.5 h-3.5" /> Approved & Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                            <ShieldAlert className="w-3.5 h-3.5" /> Pending Verification
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleStoreApproval(s.id, s.isApproved)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ml-auto ${
                            s.isApproved
                              ? 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                          }`}
                        >
                          {s.isApproved ? (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Revoke Approval
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" /> Approve Store
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL LISTINGS */}
        {activeTab === 'listings' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">All Platform Tech Listings</h3>
              <span className="text-xs text-slate-400">{products.length} Products Live</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Store Vendor</th>
                    <th className="p-4">Key Specs</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Condition</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-950 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-white text-xs">{p.title}</div>
                            <div className="text-[11px] text-blue-400">{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        {p.store?.name || 'Local Store'} ({p.store?.city})
                      </td>
                      <td className="p-4 text-slate-400">
                        {p.specifications.cpu || p.specifications.gpu || 'Hardware standard'}
                      </td>
                      <td className="p-4 font-bold text-white">
                        ${p.price}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          {p.condition.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-bold text-emerald-400">{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DISPUTES & SAFETY */}
        {activeTab === 'disputes' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-sm text-white mb-2">Omnichannel Escrow & Customer Protection Guard</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Because customers inspect laptops and phones in-store before payment, return dispute rates are 92% lower than traditional drop-shipping. Platform dispute arbitration handles store reservation cancellations and hardware warranty claims.
            </p>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>All registered stores currently in good standing with zero active fraud flags.</span>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
