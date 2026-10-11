'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { Store, Product } from '../../../types';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import BookingModal from '../../../components/BookingModal';
import {
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Star,
  Package,
} from 'lucide-react';

function StoreDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const storeData = await api.getStore(slug);
        setStore(storeData);

        const storeProducts = await api.getProducts({ storeId: storeData.id });
        setProducts(storeProducts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading store profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold mb-2">Store Not Found</h2>
          <p className="text-slate-400 mb-6 text-sm">The requested vendor profile does not exist.</p>
          <a href="/" className="px-5 py-2.5 bg-blue-600 rounded-xl text-xs font-semibold text-white">
            Return to Marketplace
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const waUrl = `https://wa.me/${store.whatsapp}?text=Hi ${store.name}! I am browsing your listings on OmniTech Marketplace.`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Cover Image */}
        <div className="h-48 sm:h-64 w-full bg-slate-900 relative overflow-hidden">
          <img src={store.coverImage} alt={store.name} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Store Profile Header */}
        <div className="max-w-7xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-10 mb-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-start sm:items-center gap-5">
              <img
                src={store.logo}
                alt={store.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-800 border-2 border-slate-700 shadow-lg flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{store.name}</h1>
                  {store.isApproved && (
                    <span className="p-1 rounded-full bg-blue-500/20 text-blue-400" title="Verified Store">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mb-3 leading-relaxed">
                  {store.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {store.address}, {store.city}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {store.rating} Rating
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Package className="w-3.5 h-3.5" />
                    {products.length} Active Listings
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="flex sm:flex-col gap-2.5 w-full md:w-auto">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Seller
              </a>
              <a
                href={`tel:${store.phone}`}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <Phone className="w-4 h-4 text-blue-400" /> Call {store.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Store Inventory Section */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              <span>Available Inventory at this Location ({products.length})</span>
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onBookNow={(prod) => {
                    setBookingProduct(prod);
                    setIsBookingOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
              No active listings available at this store right now.
            </div>
          )}
        </div>
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

export default function StoreDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm font-semibold">
          Loading store profile...
        </div>
      }
    >
      <StoreDetailContent />
    </Suspense>
  );
}
