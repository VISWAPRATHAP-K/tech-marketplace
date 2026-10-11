'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '../types';
import {
  Heart,
  Scale,
  MapPin,
  Shield,
  BatteryCharging,
  Cpu,
  Layers,
  Phone,
  MessageCircle,
  Calendar,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onBookNow: (product: Product) => void;
}

export default function ProductCard({ product, onBookNow }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('tech_wishlist') || '[]');
      setIsWishlisted(wishlist.includes(product.id));

      const compare = JSON.parse(localStorage.getItem('tech_compare') || '[]');
      setIsCompared(compare.includes(product.id));
    } catch (e) {
      // ignore
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let list = JSON.parse(localStorage.getItem('tech_compare') || '[]');
      if (list.includes(product.id)) {
        list = list.filter((id: string) => id !== product.id);
        setIsCompared(false);
      } else {
        if (list.length >= 4) {
          alert('You can compare up to 4 products at a time.');
          return;
        }
        list.push(product.id);
        setIsCompared(true);
      }
      localStorage.setItem('tech_compare', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  // WhatsApp lead URL
  const waMsg = encodeURIComponent(
    `Hello ${product.store?.name || 'Seller'}! I am interested in ${product.title} listed at $${product.price}. Is it available for store visit inspection today?`,
  );
  const whatsappUrl = `https://wa.me/${product.store?.whatsapp || '919876543210'}?text=${waMsg}`;

  const conditionColors: Record<string, string> = {
    BRAND_NEW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    LIKE_NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    REFURBISHED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    USED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <div className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1">
      {/* Thumbnail + Condition Badge + Floating Action Buttons */}
      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
        <Link href={`/products/${product.slug || product.id}`}>
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&fit=crop'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Condition Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border backdrop-blur-md uppercase tracking-wider ${
              conditionColors[product.condition] || conditionColors.BRAND_NEW
            }`}
          >
            {product.condition.replace('_', ' ')}
          </span>
        </div>

        {/* Wishlist & Compare floating buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            onClick={toggleWishlist}
            className={`p-2 rounded-xl backdrop-blur-md border transition ${
              isWishlisted
                ? 'bg-rose-500/90 text-white border-rose-400'
                : 'bg-slate-900/70 text-slate-300 hover:text-white border-slate-700/60 hover:bg-slate-900'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={toggleCompare}
            className={`p-2 rounded-xl backdrop-blur-md border transition ${
              isCompared
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-900/70 text-slate-300 hover:text-white border-slate-700/60 hover:bg-slate-900'
            }`}
            title={isCompared ? 'Remove from comparison' : 'Compare product'}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Status overlay if reserved or sold */}
        {product.status !== 'AVAILABLE' && (
          <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg">
              {product.status}
            </span>
          </div>
        )}
      </div>

      {/* Details body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Store Location */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-blue-400 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            {product.store && (
              <span className="flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="text-slate-300">{product.store.city || product.store.name}</span>
                {product.store.distanceKm !== undefined && (
                  <span className="text-emerald-400 font-medium">({product.store.distanceKm} km)</span>
                )}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="font-bold text-slate-100 text-sm hover:text-blue-400 transition line-clamp-2 leading-snug mb-2">
              {product.title}
            </h3>
          </Link>

          {/* Key Specifications Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3 text-[11px]">
            {product.specifications.cpu && (
              <span className="px-2 py-0.5 rounded-md bg-slate-900/70 border border-slate-700/50 text-slate-300 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[120px]">{product.specifications.cpu}</span>
              </span>
            )}
            {product.specifications.gpu && (
              <span className="px-2 py-0.5 rounded-md bg-slate-900/70 border border-slate-700/50 text-slate-300 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[120px]">{product.specifications.gpu}</span>
              </span>
            )}
            {product.specifications.ram && (
              <span className="px-2 py-0.5 rounded-md bg-slate-900/70 border border-slate-700/50 text-slate-300">
                {product.specifications.ram}
              </span>
            )}
            {product.specifications.storage && (
              <span className="px-2 py-0.5 rounded-md bg-slate-900/70 border border-slate-700/50 text-slate-300">
                {product.specifications.storage}
              </span>
            )}
          </div>

          {/* Warranty & Battery Health badges */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-4 border-t border-slate-700/40 pt-2">
            <span className="flex items-center gap-1 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              {product.warrantyMonths}m Warranty
            </span>
            {product.batteryHealthPct && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <BatteryCharging className="w-3.5 h-3.5" />
                {product.batteryHealthPct}% Battery Health
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-black text-white">${product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-xs text-slate-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                Save ${product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Action buttons: Book Now + WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onBookNow(product)}
              disabled={product.status !== 'AVAILABLE'}
              className="py-2 px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-600/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Now
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
