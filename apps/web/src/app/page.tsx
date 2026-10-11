'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../lib/api';
import { Product, Category, Store } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import BookingModal from '../components/BookingModal';
import Link from 'next/link';
import {
  Laptop,
  Smartphone,
  Gamepad2,
  Cpu,
  Camera,
  Tv,
  MapPin,
  Sparkles,
  Phone,
  MessageCircle,
  Scale,
  CheckCircle2,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
};

function HomeContent() {
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedCpu, setSelectedCpu] = useState<string>('');
  const [selectedGpu, setSelectedGpu] = useState<string>('');
  const [selectedRam, setSelectedRam] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');

  // Modals & Active Selections
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Read URL params (search, category, city, wishlist)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Load Categories & Stores
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, storeList] = await Promise.all([
          api.getCategories(),
          api.getStores({ city: searchParams.get('city') || undefined }),
        ]);
        setCategories(cats);
        setStores(storeList);
      } catch (e) {
        console.error(e);
      }
    }
    loadMeta();
  }, [searchParams]);

  // Load Products whenever filters change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const search = searchParams.get('search') || undefined;
        const isWishlist = searchParams.get('wishlist') === 'true';

        let list = await api.getProducts({
          search,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          condition: selectedCondition === 'ALL' ? undefined : selectedCondition,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          cpu: selectedCpu || undefined,
          gpu: selectedGpu || undefined,
          ram: selectedRam || undefined,
          storage: selectedStorage || undefined,
        });

        if (isWishlist) {
          const wishlist = JSON.parse(localStorage.getItem('tech_wishlist') || '[]');
          list = list.filter((p) => wishlist.includes(p.id));
        }

        setProducts(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    selectedCategory,
    selectedCondition,
    minPrice,
    maxPrice,
    selectedCpu,
    selectedGpu,
    selectedRam,
    selectedStorage,
    searchParams,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCondition('ALL');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCpu('');
    setSelectedGpu('');
    setSelectedRam('');
    setSelectedStorage('');
  };

  const handleOpenBooking = (prod: Product) => {
    setBookingProduct(prod);
    setIsBookingOpen(true);
  };

  const searchQuery = searchParams.get('search');
  const cityQuery = searchParams.get('city');
  const isWishlistQuery = searchParams.get('wishlist') === 'true';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-16 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 border-b border-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Omnichannel Tech Marketplace</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
                Inspect In Person. <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Reserve Top Tech Locally.
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                Compare verified laptops, RTX gaming rigs, certified iPhones, and PC hardware from trusted local stores. Book your slot for free, run hardware benchmarks on-site, and take it home.
              </p>

              {/* Quick stats pills */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Store Partners</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>48-Hour Zero Deposit Hold</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct WhatsApp Seller Chat</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories Bar */}
        <section className="py-6 border-b border-slate-900 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>All Tech</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
                    selectedCategory === cat.slug
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-blue-400">{iconMap[cat.icon] || <Cpu className="w-4 h-4" />}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Stores Strip */}
        {stores.length > 0 && !searchQuery && !isWishlistQuery && (
          <section className="py-8 bg-slate-950 border-b border-slate-900">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Nearby Partner Stores {cityQuery ? `in ${cityQuery}` : ''}</span>
                  </h2>
                  <p className="text-xs text-slate-400">Visit in-store to inspect, benchmark, and pick up reservations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stores.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex gap-3 items-center justify-between transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={s.logo}
                        alt={s.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-800 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <Link href={`/stores/${s.slug || s.id}`}>
                          <h4 className="font-bold text-sm text-white hover:text-blue-400 transition truncate">
                            {s.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-400 truncate">{s.address}, {s.city}</p>
                        <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold mt-0.5">
                          <span>★ {s.rating}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-emerald-400 font-medium">Verified Vendor</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <a
                        href={`https://wa.me/${s.whatsapp}?text=Hi! I found your store on OmniTech Marketplace.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Products Catalog & Sidebar */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Active search or wishlist banner */}
            {(searchQuery || isWishlistQuery) && (
              <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {isWishlistQuery ? '❤️ Your Saved Wishlist' : `Search Results for "${searchQuery}"`}
                  </h3>
                  <p className="text-xs text-slate-400">Found {products.length} products matching your criteria</p>
                </div>
                <Link
                  href="/"
                  className="text-xs font-semibold text-blue-400 hover:underline"
                >
                  Clear & View All
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar Filter */}
              <div className="lg:col-span-1">
                <ProductFilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  selectedCondition={selectedCondition}
                  onSelectCondition={setSelectedCondition}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  selectedCpu={selectedCpu}
                  setSelectedCpu={setSelectedCpu}
                  selectedGpu={selectedGpu}
                  setSelectedGpu={setSelectedGpu}
                  selectedRam={selectedRam}
                  setSelectedRam={setSelectedRam}
                  selectedStorage={selectedStorage}
                  setSelectedStorage={setSelectedStorage}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Right Products Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400">
                    Showing <strong className="text-white">{products.length}</strong> devices available for reservation
                  </span>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
                      />
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {products.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onBookNow={handleOpenBooking}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
                    <Laptop className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-white mb-1">No products match your filters</h4>
                    <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                      Try relaxing your price range or CPU/GPU filters to see available units.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
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

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm font-semibold">
          Loading OmniTech Marketplace...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
