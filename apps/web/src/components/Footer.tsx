import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Cpu, Phone, Clock, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20">
      {/* 3 Pillars / Omnichannel Guarantees */}
      <div className="border-b border-slate-900 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Reserve Online, Test In Person</h4>
              <p className="text-slate-400 leading-relaxed">
                No surprises. Book any device for free, visit your local store, test benchmark speeds & battery health before paying.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">48-Hour In-Store Hold</h4>
              <p className="text-slate-400 leading-relaxed">
                When you click "Book Now", verified store owners lock the product so nobody else buys it before your visit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Direct Seller WhatsApp & Calls</h4>
              <p className="text-slate-400 leading-relaxed">
                Negotiate trade-ins, request custom RAM/SSD upgrades, and ask for video verification directly with sellers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-white text-base">OmniTech Marketplace</span>
          </div>
          <p className="text-slate-500 leading-relaxed mb-4">
            Connecting local electronics retailers with buyers looking for verified laptops, smartphones, custom gaming rigs, and photography gear.
          </p>
          <div className="text-slate-400 text-[11px]">
            © 2026 OmniTech E-Com. All rights reserved.
          </div>
        </div>

        <div>
          <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Popular Tech</h5>
          <ul className="space-y-2">
            <li><Link href="/?category=laptops" className="hover:text-blue-400 transition">MacBook & Gaming Laptops</Link></li>
            <li><Link href="/?category=phones" className="hover:text-blue-400 transition">iPhones & Galaxy Flagships</Link></li>
            <li><Link href="/?category=pc-parts" className="hover:text-blue-400 transition">RTX 4090 / 4080 Graphics Cards</Link></li>
            <li><Link href="/?category=gaming" className="hover:text-blue-400 transition">PlayStation 5 & Handhelds</Link></li>
            <li><Link href="/?category=cameras" className="hover:text-blue-400 transition">Mirrorless 4K Cameras</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">For Sellers & Stores</h5>
          <ul className="space-y-2">
            <li><Link href="/admin" className="hover:text-blue-400 transition">Store Owner Dashboard</Link></li>
            <li><Link href="/admin" className="hover:text-blue-400 transition">Manage Inventory & Specs</Link></li>
            <li><Link href="/admin" className="hover:text-blue-400 transition">Customer Booking Requests</Link></li>
            <li><Link href="/super-admin" className="hover:text-blue-400 transition">Super Admin Platform Panel</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Store Locations</h5>
          <p className="text-slate-500 mb-2">Verified local partners in:</p>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300">Mumbai</span>
            <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300">Bangalore</span>
            <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300">Delhi</span>
            <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300">Noida</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
