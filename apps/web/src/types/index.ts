export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string;
  rating: number;
  isApproved: boolean;
  isActive: boolean;
  distanceKm?: number;
  createdAt: string;
}

export interface ProductSpec {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  display?: string;
  os?: string;
  color?: string;
  additional?: Record<string, any>;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: 'BRAND_NEW' | 'LIKE_NEW' | 'REFURBISHED' | 'USED';
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  warrantyMonths: number;
  batteryHealthPct?: number;
  images: string[];
  isFeatured: boolean;
  createdAt: string;
  specifications: ProductSpec;
  store?: Partial<Store>;
  category?: Partial<Category>;
}

export interface Booking {
  id: string;
  productId: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  product?: Partial<Product>;
  store?: Partial<Store>;
}

export interface Enquiry {
  id: string;
  productId?: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'RESOLVED';
  createdAt: string;
}

export interface StoreStats {
  storeId: string;
  productsCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  inventoryValue: number;
  bookingsCount: number;
  pendingBookings: number;
  confirmedBookings: number;
  enquiriesCount: number;
}

export interface PlatformStats {
  totalStores: number;
  approvedStores: number;
  pendingStores: number;
  totalListings: number;
  totalBookings: number;
  totalEnquiries: number;
  totalGrossMerchandiseValue: number;
}
