'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Product } from '../../../types';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import BookingModal from '../../../components/BookingModal';
import {
  Shield,
  BatteryCharging,
  Cpu,
  Layers,
  MapPin,
  Calendar,
  MessageCircle,
  Phone,
  Scale,
  Heart,
  ChevronRight,
  HardDrive,
  Monitor,
  CheckCircle2,
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await api.getProduct(slug);
        setProduct(data);
        if (data.images?.length) {
          setActiveImage(data.images[0]);
        }

        const wishlist = JSON.parse(localStorage.getItem('tech_wishlist') || '[]');
        setIsWishlisted(wishlist.includes(data.id));

        const compare = JSON.parse(localStorage.getItem('tech_compare') || '[]');
        setIsCompared(compare.includes(data.id));
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
          <div className="animate-pulse text-slate-400 font-semibold">Loading product specifications...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-slate-400 mb-6 text-sm">The requested tech item might have been unlisted or reserved.</p>
          <a href="/" className="px-5 py-2.5 bg-blue-600 rounded-xl text-xs font-semibold text-white">
            Return to Marketplace
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleWishlist = () => {
    try {
      let list = JSON.parse(localStorage.getItem('tech_wishlist') || '[]');
      if (list.includes(product.id)) {
        list = list.filter((id: string) => id !== product.id);
        setIsWishlisted(false);
      } else {
        list.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem('tech_wishlist', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const toggleCompare = () => {
    try {
      let list = JSON.parse(localStorage.getItem('tech_compare') || '[]');
      if (list.includes(product.id)) {
        list = list.filter((id: string) => id !== product.id);
        setIsCompared(false);
      } else {
        if (list.length >= 4) {
          alert('You can compare up to 4 devices at a time.');
          return;
        }
        list.push(product.id);
        setIsCompared(true);
      }
      localStorage.setItem('tech_compare', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const waMsg = encodeURIComponent(
    `Hello ${product.store?.name || 'Seller'}! I am inquiring about "${product.title}" ($${product.price}) from OmniTech Marketplace. Can I visit today to inspect and test it?`,
  );
  const whatsappUrl = `https://wa.me/${product.store?.whatsapp || '919876543210'}?text=${waMsg}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <a href="/" className="hover:text-blue-400">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-300">{product.category?.name || 'Devices'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium truncate max-w-xs">{product.title}</span>
        </div>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Photos Gallery */}
          <div>
            <div className="aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 mb-4 shadow-xl">
              <img
                src={activeImage || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                      activeImage === img ? 'border-blue-500 shadow-md' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Action Deck */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  {product.condition.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleCompare}
                    className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                      isCompared
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{isCompared ? 'Compared' : 'Compare'}</span>
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-xl border transition ${
                      isWishlisted
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-snug">
                {product.title}
              </h1>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-4 mb-5 pb-5 border-b border-slate-800">
                <span className="text-3xl font-black text-white">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-base text-slate-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    Save ${product.originalPrice - product.price}
                  </span>
                )}
              </div>

              {/* Verified Guarantees Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold text-white">{product.warrantyMonths} Months Warranty</div>
                    <div className="text-[11px] text-slate-400">Direct Hardware Guarantee</div>
                  </div>
                </div>

                {product.batteryHealthPct && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                    <BatteryCharging className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">{product.batteryHealthPct}% Battery Health</div>
                      <div className="text-[11px] text-slate-400">Tested Hardware Cycle</div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Store Information Card & CTA Deck */}
            <div className="space-y-4">
              {product.store && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-xs font-bold text-white">{product.store.name}</div>
                      <div className="text-[11px] text-slate-400">{product.store.address}, {product.store.city}</div>
                    </div>
                  </div>
                  <a
                    href={`/stores/${product.store.slug || product.store.id}`}
                    className="text-xs text-blue-400 hover:underline font-semibold"
                  >
                    View Store
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  disabled={product.status !== 'AVAILABLE'}
                  className="py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Now (Hold In-Store)</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Seller</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Matrix */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span>Technical Specifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-xs">
            {product.specifications.cpu && (
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Processor (CPU)</span>
                <span className="text-white font-semibold">{product.specifications.cpu}</span>
              </div>
            )}
            {product.specifications.gpu && (
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Graphics (GPU)</span>
                <span className="text-white font-semibold">{product.specifications.gpu}</span>
              </div>
            )}
            {product.specifications.ram && (
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Memory (RAM)</span>
                <span className="text-white font-semibold">{product.specifications.ram}</span>
              </div>
            )}
            {product.specifications.storage && (
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Storage Drive</span>
                <span className="text-white font-semibold">{product.specifications.storage}</span>
              </div>
            )}
            {product.specifications.display && (
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Display Screen</span>
                <span className="text-white font-semibold">{product.specifications.display}</span>
              </div>
            )}
            {product.specifications.os && (
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Operating System</span>
                <span className="text-white font-semibold">{product.specifications.os}</span>
              </div>
            )}
            {product.specifications.color && (
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Color Finish</span>
                <span className="text-white font-semibold">{product.specifications.color}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Condition Grade</span>
              <span className="text-white font-semibold">{product.condition.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Hardware Warranty</span>
              <span className="text-white font-semibold">{product.warrantyMonths} Months</span>
            </div>
          </div>
        </section>
      </main>

      <BookingModal
        product={product}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm font-semibold">
          Loading product specifications...
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
