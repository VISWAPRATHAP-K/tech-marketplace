import {
  Product,
  Category,
  Store,
  Booking,
  Enquiry,
  StoreStats,
  PlatformStats,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function safeFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  // Categories
  async getCategories(): Promise<Category[]> {
    return safeFetch<Category[]>('/products/categories', undefined, [
      { id: 'cat-1', name: 'Laptops', slug: 'laptops', icon: 'Laptop', description: 'MacBooks, Gaming Laptops, Ultrabooks & Workstations' },
      { id: 'cat-2', name: 'Phones', slug: 'phones', icon: 'Smartphone', description: 'iPhones, Flagships, Foldables & Budget Smartphones' },
      { id: 'cat-3', name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', description: 'PlayStation, Xbox, Steam Decks, Handhelds & Accessories' },
      { id: 'cat-4', name: 'PC Parts', slug: 'pc-parts', icon: 'Cpu', description: 'GPUs, Processors, Motherboards, RAM & Custom PC Rigs' },
      { id: 'cat-5', name: 'Cameras', slug: 'cameras', icon: 'Camera', description: 'Mirrorless, DSLRs, Lenses, Gimbals & Studio Gear' },
      { id: 'cat-6', name: 'Appliances', slug: 'appliances', icon: 'Tv', description: 'Smart 4K TVs, Audio systems, Monitored tech & Home gear' },
    ]);
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return safeFetch<Product[]>(`/products${qStr}`, undefined, []);
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    return safeFetch<Product>(`/products/${idOrSlug}`);
  },

  async compareProducts(ids: string[]): Promise<Product[]> {
    return safeFetch<Product[]>(`/products/compare?ids=${ids.join(',')}`, undefined, []);
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    return safeFetch<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return safeFetch<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return safeFetch<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Stores
  async getStores(params?: { city?: string; lat?: number; lng?: number; radiusKm?: number }): Promise<Store[]> {
    const query = new URLSearchParams();
    if (params?.city) query.append('city', params.city);
    if (params?.lat) query.append('lat', String(params.lat));
    if (params?.lng) query.append('lng', String(params.lng));
    if (params?.radiusKm) query.append('radiusKm', String(params.radiusKm));
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return safeFetch<Store[]>(`/stores${qStr}`, undefined, []);
  },

  async getStore(idOrSlug: string): Promise<Store> {
    return safeFetch<Store>(`/stores/${idOrSlug}`);
  },

  // Bookings ("Book Now")
  async createBooking(data: Partial<Booking>): Promise<Booking> {
    return safeFetch<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getBookings(storeId?: string): Promise<Booking[]> {
    const q = storeId ? `?storeId=${storeId}` : '';
    return safeFetch<Booking[]>(`/bookings${q}`, undefined, []);
  },

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    return safeFetch<Booking>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Enquiries
  async createEnquiry(data: Partial<Enquiry>): Promise<Enquiry> {
    return safeFetch<Enquiry>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getEnquiries(storeId?: string): Promise<Enquiry[]> {
    const q = storeId ? `?storeId=${storeId}` : '';
    return safeFetch<Enquiry[]>(`/enquiries${q}`, undefined, []);
  },

  // Admin
  async getStoreStats(storeId: string): Promise<StoreStats> {
    return safeFetch<StoreStats>(`/admin/store-stats/${storeId}`);
  },

  async getPlatformStats(): Promise<PlatformStats> {
    return safeFetch<PlatformStats>('/admin/platform-stats');
  },

  async getAllStoresForAdmin(): Promise<Store[]> {
    return safeFetch<Store[]>('/admin/stores/all');
  },

  async setStoreApproval(storeId: string, isApproved: boolean): Promise<Store> {
    return safeFetch<Store>(`/admin/stores/${storeId}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
  },
};
