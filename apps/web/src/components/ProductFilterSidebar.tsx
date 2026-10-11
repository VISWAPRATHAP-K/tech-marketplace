'use client';

import React from 'react';
import { Category } from '../types';
import { Filter, RotateCcw, Cpu, Layers, HardDrive } from 'lucide-react';

interface FilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  selectedCpu: string;
  setSelectedCpu: (val: string) => void;
  selectedGpu: string;
  setSelectedGpu: (val: string) => void;
  selectedRam: string;
  setSelectedRam: (val: string) => void;
  selectedStorage: string;
  setSelectedStorage: (val: string) => void;
  onReset: () => void;
}

export default function ProductFilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedCondition,
  onSelectCondition,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedCpu,
  setSelectedCpu,
  selectedGpu,
  setSelectedGpu,
  selectedRam,
  setSelectedRam,
  selectedStorage,
  setSelectedStorage,
  onReset,
}: FilterProps) {
  const conditions = [
    { label: 'All Conditions', value: 'ALL' },
    { label: 'Brand New', value: 'BRAND_NEW' },
    { label: 'Like New (Open Box)', value: 'LIKE_NEW' },
    { label: 'Certified Refurbished', value: 'REFURBISHED' },
    { label: 'Pre-Owned (Used)', value: 'USED' },
  ];

  const cpuOptions = ['Any CPU', 'Apple M3', 'Intel Core i9', 'Intel Core i7', 'AMD Ryzen', 'Snapdragon'];
  const gpuOptions = ['Any GPU', 'RTX 4090', 'RTX 4080', 'Apple GPU', 'Iris Xe'];
  const ramOptions = ['Any RAM', '8GB', '16GB', '32GB', '36GB', '64GB'];
  const storageOptions = ['Any Storage', '256GB', '512GB', '1TB', '2TB'];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-200 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Filters & Specifications</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
          title="Reset All Filters"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category Pills */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Category
        </label>
        <div className="flex flex-col gap-1 text-xs">
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-left px-3 py-1.5 rounded-lg transition font-medium ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`text-left px-3 py-1.5 rounded-lg transition font-medium flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Price Range ($)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <span className="text-slate-500 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Condition Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Condition
        </label>
        <div className="space-y-1.5 text-xs">
          {conditions.map((c) => (
            <label
              key={c.value}
              className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
            >
              <input
                type="radio"
                name="condition"
                value={c.value}
                checked={selectedCondition === c.value}
                onChange={() => onSelectCondition(c.value)}
                className="text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tech Specs: CPU */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-400" /> Processor (CPU)
        </label>
        <select
          value={selectedCpu}
          onChange={(e) => setSelectedCpu(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {cpuOptions.map((opt) => (
            <option key={opt} value={opt === 'Any CPU' ? '' : opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Tech Specs: GPU */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" /> Graphics (GPU)
        </label>
        <select
          value={selectedGpu}
          onChange={(e) => setSelectedGpu(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {gpuOptions.map((opt) => (
            <option key={opt} value={opt === 'Any GPU' ? '' : opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Tech Specs: RAM & Storage */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            RAM
          </label>
          <select
            value={selectedRam}
            onChange={(e) => setSelectedRam(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {ramOptions.map((opt) => (
              <option key={opt} value={opt === 'Any RAM' ? '' : opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Storage
          </label>
          <select
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {storageOptions.map((opt) => (
              <option key={opt} value={opt === 'Any Storage' ? '' : opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
