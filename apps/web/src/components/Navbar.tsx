'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Scale,
  Heart,
  Store as StoreIcon,
  ShieldCheck,
  Laptop,
  Cpu,
  Layers,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [compareCount, setCompareCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    // Listen for compare/wishlist updates from localStorage
    const updateCounters = () => {
      try {
        const compareIds = JSON.parse(localStorage.getItem('tech_compare') || '[]');
        setCompareCount(compareIds.length);
        const wishlistIds = JSON.parse(localStorage.getItem('tech_wishlist') || '[]');
        setWishlistCount(wishlistIds.length);
      } catch (e) {
        // ignore
      }
    };

    updateCounters();
    window.addEventListener('storage', updateCounters);
    const interval = setInterval(updateCounters, 1000);
    return () => {
      window.removeEventListener('storage', updateCounters);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 py-1.5 px-4 text-xs font-medium text-white flex justify-between items-center text-center">
        <div className="flex items-center gap-2 mx-auto">
          <ShieldCheck className="w-4 h-4 text-green-300" />
          <span>Omnichannel Marketplace: <strong>Reserve Online, Inspect & Test In-Store Before Paying!</strong></span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
          <Link href="/admin" className="hover:underline flex items-center gap-1">
            <StoreIcon className="w-3.5 h-3.5" /> Store Owner Admin
          </Link>
          <span className="text-white/40">|</span>
          <Link href="/super-admin" className="hover:underline flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Super Admin
          </Link>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
              OmniTech<span className="text-blue-500">.</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
              Local Tech Marketplace
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search RTX 4080, MacBook M3, i9, 32GB RAM, ThinkPad, iPhone..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-800/90 border border-slate-700 rounded-full text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-full transition shadow-md"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right actions: City, Compare, Wishlist */}
        <div className="flex items-center gap-3">
          {/* City / Location Selector */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                const cityParam = e.target.value === 'All Cities' ? '' : `city=${e.target.value}`;
                router.push(cityParam ? `/?${cityParam}` : '/');
              }}
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-medium"
            >
              <option value="All Cities" className="bg-slate-900">All Cities</option>
              <option value="Mumbai" className="bg-slate-900">Mumbai</option>
              <option value="Bangalore" className="bg-slate-900">Bangalore</option>
              <option value="Delhi" className="bg-slate-900">Delhi</option>
              <option value="Noida" className="bg-slate-900">Noida</option>
            </select>
          </div>

          {/* Compare Button */}
          <Link
            href="/compare"
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Compare Products"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Wishlist Button */}
          <Link
            href="/?wishlist=true"
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-rose-400" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
