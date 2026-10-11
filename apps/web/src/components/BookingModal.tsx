'use client';

import React, { useState } from 'react';
import { Product } from '../types';
import { api } from '../lib/api';
import { X, Calendar, User, Phone, MapPin, CheckCircle, MessageSquare } from 'lucide-react';

interface BookingModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ product, isOpen, onClose }: BookingModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createBooking({
        productId: product.id,
        storeId: product.storeId,
        customerName,
        customerPhone,
        bookingDate: bookingDate || new Date(Date.now() + 86400000).toISOString(),
        notes,
      });
      setSuccessBookingId(res.id || `RSV-${Date.now().toString().slice(-5)}`);
    } catch (err) {
      alert('Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello! I just placed reservation #${successBookingId} for "${product.title}" ($${product.price}). My name is ${customerName}. When can I visit to test and collect?`,
  );
  const whatsappUrl = `https://wa.me/${product.store?.whatsapp || '919876543210'}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!successBookingId ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reserve For In-Store Visit</h3>
                <p className="text-xs text-slate-400">Zero upfront payment. Hold item for 48 hours to inspect in person.</p>
              </div>
            </div>

            {/* Product summary card */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 mb-5 flex gap-3 items-center">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg bg-slate-900 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate text-white">{product.title}</div>
                <div className="text-xs text-slate-400">
                  {product.specifications.cpu || product.brand} • {product.condition}
                </div>
                <div className="text-sm font-bold text-blue-400 mt-0.5">${product.price}</div>
              </div>
            </div>

            {/* Store Information */}
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-3 mb-5 text-xs text-slate-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">{product.store?.name || 'Local Certified Store'}</span>
                <p className="text-slate-400 mt-0.5">{product.store?.city || 'City Center'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (For WhatsApp / SMS Confirmation) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Store Visit Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Special Request / Test Requirement</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please charge battery to 100% or run Cinebench benchmark before visit"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Reserving...' : 'Confirm In-Store Reservation'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Reservation Confirmed!</h3>
            <p className="text-xs text-slate-400 mb-4">
              Reservation ID: <strong className="text-blue-400 font-mono">{successBookingId}</strong>
            </p>

            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 text-left text-xs text-slate-300 mb-6 space-y-2">
              <div>
                <strong>Product:</strong> {product.title}
              </div>
              <div>
                <strong>Store:</strong> {product.store?.name}
              </div>
              <div>
                <strong>Hold Guarantee:</strong> The seller has reserved this unit for you for 48 hours. No advance deposit required.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" /> Message Seller on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
