'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Product } from '../../types';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BookingModal from '../../components/BookingModal';
import { Scale, Trash2, Cpu, Layers, Shield, BatteryCharging, Calendar, X } from 'lucide-react';

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const ids: string[] = JSON.parse(localStorage.getItem('tech_compare') || '[]');
        if (ids.length > 0) {
          const list = await api.compareProducts(ids);
          setProducts(list);
        } else {
          setProducts([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const removeFromCompare = (id: string) => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('tech_compare') || '[]');
      const filtered = ids.filter((x) => x !== id);
      localStorage.setItem('tech_compare', JSON.stringify(filtered));
      setProducts(products.filter((p) => p.id !== id));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const clearAll = () => {
    localStorage.removeItem('tech_compare');
    setProducts([]);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <Scale className="w-7 h-7 text-blue-500" />
              <span>Compare Devices Side-by-Side</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Analyze specs, graphics cards, battery health, and prices before reserving in-store.
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading comparison matrix...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
            <Scale className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">No Devices Selected for Comparison</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
              Browse products and click the "Compare" icon on up to 4 devices to see their specs side-by-side.
            </p>
            <a
              href="/"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition"
            >
              Browse Catalog
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-4 text-left font-bold text-slate-400 bg-slate-900/80 border-b border-slate-800 w-48">
                    Specification
                  </th>
                  {products.map((p) => (
                    <th
                      key={p.id}
                      className="p-4 text-left bg-slate-900/60 border-b border-slate-800 min-w-[240px] max-w-[280px] align-top relative"
                    >
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute right-2 top-2 p-1 text-slate-500 hover:text-rose-400"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 mb-3">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        {p.brand}
                      </span>
                      <h4 className="font-bold text-white text-sm line-clamp-2 my-1">{p.title}</h4>
                      <div className="text-base font-black text-white mb-3">${p.price}</div>
                      <button
                        onClick={() => {
                          setBookingProduct(p);
                          setIsBookingOpen(true);
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Book Now
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">Condition</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-white font-medium">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                        {p.condition.replace('_', ' ')}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">Processor (CPU)</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-white font-medium">
                      {p.specifications.cpu || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">Graphics (GPU)</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-white font-medium">
                      {p.specifications.gpu || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">RAM</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-white font-medium">
                      {p.specifications.ram || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">Storage</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-white font-medium">
                      {p.specifications.storage || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">Display</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-white font-medium">
                      {p.specifications.display || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">Battery Health</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-emerald-400 font-bold">
                      {p.batteryHealthPct ? `${p.batteryHealthPct}%` : 'N/A (Desktop / Sealed)'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">Warranty</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-white font-medium">
                      {p.warrantyMonths} Months Hardware
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-900/30">Store Location</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-slate-300">
                      {p.store?.name} ({p.store?.city})
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>

      <BookingModal
        product={bookingProduct}
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingProduct(null);
        }}
      />

      <Footer />
    </div>
  );
}
