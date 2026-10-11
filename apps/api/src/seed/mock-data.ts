export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface IStore {
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
  createdAt: string;
}

export interface IProductSpec {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  display?: string;
  os?: string;
  color?: string;
  additional?: Record<string, any>;
}

export interface IProduct {
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
  specifications: IProductSpec;
  store?: Partial<IStore>;
  category?: Partial<ICategory>;
}

export interface IBooking {
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
  product?: Partial<IProduct>;
  store?: Partial<IStore>;
}

export interface IEnquiry {
  id: string;
  productId?: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'RESOLVED';
  createdAt: string;
  product?: Partial<IProduct>;
  store?: Partial<IStore>;
}

export const INITIAL_CATEGORIES: ICategory[] = [
  { id: 'cat-1', name: 'Laptops', slug: 'laptops', icon: 'Laptop', description: 'MacBooks, Gaming Laptops, Ultrabooks & Workstations' },
  { id: 'cat-2', name: 'Phones', slug: 'phones', icon: 'Smartphone', description: 'iPhones, Flagships, Foldables & Budget Smartphones' },
  { id: 'cat-3', name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', description: 'PlayStation, Xbox, Steam Decks, Handhelds & Accessories' },
  { id: 'cat-4', name: 'PC Parts', slug: 'pc-parts', icon: 'Cpu', description: 'GPUs, Processors, Motherboards, RAM & Custom PC Rigs' },
  { id: 'cat-5', name: 'Cameras', slug: 'cameras', icon: 'Camera', description: 'Mirrorless, DSLRs, Lenses, Gimbals & Studio Gear' },
  { id: 'cat-6', name: 'Appliances', slug: 'appliances', icon: 'Tv', description: 'Smart 4K TVs, Audio systems, Monitored tech & Home gear' },
];

export const INITIAL_STORES: IStore[] = [
  {
    id: 'store-1',
    ownerId: 'owner-1',
    name: 'Apex Tech Hub',
    slug: 'apex-tech-hub',
    description: 'Premier certified pre-owned Apple & high-end Windows devices. Free in-store hardware diagnostics with every reservation.',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=400&fit=crop',
    address: '42 Lamington Road, Grant Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400007',
    latitude: 18.9616,
    longitude: 72.8164,
    phone: '+919876543210',
    whatsapp: '919876543210',
    rating: 4.9,
    isApproved: true,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'store-2',
    ownerId: 'owner-2',
    name: 'Silicon City Computers',
    slug: 'silicon-city-computers',
    description: 'Specialists in custom water-cooled gaming rigs, RTX GPUs, and enterprise ThinkPads.',
    logo: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
    address: '104 SP Road, Electronics Market',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560002',
    latitude: 12.9657,
    longitude: 77.5852,
    phone: '+919811223344',
    whatsapp: '919811223344',
    rating: 4.8,
    isApproved: true,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'store-3',
    ownerId: 'owner-3',
    name: 'NextGen Gadgets Plaza',
    slug: 'nextgen-gadgets-plaza',
    description: 'Verified smartphones, mirrorless cameras, and smart gadgets with genuine warranty cards.',
    logo: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop',
    address: 'Block E, Connaught Place',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110001',
    latitude: 28.6328,
    longitude: 77.2197,
    phone: '+919899001122',
    whatsapp: '919899001122',
    rating: 4.7,
    isApproved: true,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'store-4',
    ownerId: 'owner-4',
    name: 'Prime Pixel Electronics',
    slug: 'prime-pixel-electronics',
    description: 'Recently registered vendor pending platform verification.',
    logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=400&fit=crop',
    address: 'Sector 18 Market',
    city: 'Noida',
    state: 'Uttar Pradesh',
    postalCode: '201301',
    latitude: 28.5708,
    longitude: 77.3271,
    phone: '+919988776655',
    whatsapp: '919988776655',
    rating: 4.5,
    isApproved: false, // For Super Admin approval flow!
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PRODUCTS: IProduct[] = [
  {
    id: 'prod-1',
    storeId: 'store-1',
    categoryId: 'cat-1',
    title: 'Apple MacBook Pro 16" (M3 Max, 36GB, 1TB SSD)',
    slug: 'apple-macbook-pro-16-m3-max',
    brand: 'Apple',
    model: 'MacBook Pro 16',
    description: 'Space Black beast with 16-Core CPU, 40-Core GPU, Liquid Retina XDR screen. Box, original 140W MagSafe charger included. 100% battery capacity.',
    price: 2899,
    originalPrice: 3499,
    condition: 'LIKE_NEW',
    status: 'AVAILABLE',
    warrantyMonths: 10,
    batteryHealthPct: 100,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop',
    ],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    specifications: {
      cpu: 'Apple M3 Max (16-core)',
      gpu: 'Apple 40-core GPU',
      ram: '36GB Unified Memory',
      storage: '1TB NVMe SSD',
      display: '16.2" Liquid Retina XDR (3456x2234, 120Hz ProMotion)',
      os: 'macOS Sonoma',
      color: 'Space Black',
    },
  },
  {
    id: 'prod-2',
    storeId: 'store-2',
    categoryId: 'cat-1',
    title: 'Lenovo Legion Pro 7i Gen 9 (RTX 4080, i9-14900HX)',
    slug: 'lenovo-legion-pro-7i-rtx4080',
    brand: 'Lenovo',
    model: 'Legion Pro 7i 16IRX9H',
    description: 'Ultimate esports gaming laptop. PureSight 240Hz OLED Display, coldfront 5.0 vapor chamber, RGB per-key keyboard.',
    price: 2199,
    originalPrice: 2699,
    condition: 'BRAND_NEW',
    status: 'AVAILABLE',
    warrantyMonths: 24,
    batteryHealthPct: 100,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop',
    ],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    specifications: {
      cpu: 'Intel Core i9-14900HX (24 Cores)',
      gpu: 'NVIDIA GeForce RTX 4080 (12GB GDDR6, 175W TGP)',
      ram: '32GB DDR5-5600MHz',
      storage: '2TB PCIe Gen4 NVMe SSD',
      display: '16" WQXGA (2560x1600) IPS 240Hz 500nits G-SYNC',
      os: 'Windows 11 Home',
      color: 'Onyx Grey',
    },
  },
  {
    id: 'prod-3',
    storeId: 'store-1',
    categoryId: 'cat-1',
    title: 'Lenovo ThinkPad X1 Carbon Gen 11 (Core i7, 16GB)',
    slug: 'lenovo-thinkpad-x1-carbon-gen-11',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon',
    description: 'Ultralight carbon fiber business powerhouse. Legendary keyboard, 1.12kg weight, rapid charge, Dolby Voice microphones.',
    price: 1099,
    originalPrice: 1899,
    condition: 'REFURBISHED',
    status: 'AVAILABLE',
    warrantyMonths: 12,
    batteryHealthPct: 94,
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop',
    ],
    isFeatured: false,
    createdAt: new Date().toISOString(),
    specifications: {
      cpu: 'Intel Core i7-1365U vPro (10 Cores)',
      gpu: 'Intel Iris Xe Graphics',
      ram: '16GB LPDDR5-6400MHz',
      storage: '512GB PCIe Gen4 SSD',
      display: '14" WUXGA (1920x1200) IPS Anti-glare 400nits',
      os: 'Windows 11 Pro',
      color: 'Deep Black Carbon',
    },
  },
  {
    id: 'prod-4',
    storeId: 'store-3',
    categoryId: 'cat-2',
    title: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    slug: 'apple-iphone-15-pro-max-256gb',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    description: 'Aerospace-grade titanium design. 5x Telephoto optical zoom camera, Action button, USB-C 3.0, 96% battery cycle health.',
    price: 999,
    originalPrice: 1199,
    condition: 'LIKE_NEW',
    status: 'AVAILABLE',
    warrantyMonths: 6,
    batteryHealthPct: 96,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop',
    ],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    specifications: {
      cpu: 'Apple A17 Pro (3nm)',
      gpu: 'Apple 6-core GPU with Hardware Ray Tracing',
      ram: '8GB RAM',
      storage: '256GB NVMe',
      display: '6.7" Super Retina XDR OLED (120Hz ProMotion)',
      os: 'iOS 18',
      color: 'Natural Titanium',
    },
  },
  {
    id: 'prod-5',
    storeId: 'store-3',
    categoryId: 'cat-2',
    title: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    description: 'Galaxy AI built-in, integrated S Pen stylus, flat 2600nits anti-reflective screen, 200MP Quad Telephoto camera system.',
    price: 1149,
    originalPrice: 1419,
    condition: 'BRAND_NEW',
    status: 'AVAILABLE',
    warrantyMonths: 12,
    batteryHealthPct: 100,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop',
    ],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    specifications: {
      cpu: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
      gpu: 'Adreno 750',
      ram: '12GB LPDDR5X',
      storage: '512GB UFS 4.0',
      display: '6.8" Dynamic AMOLED 2X (1-120Hz, Gorilla Armor)',
      os: 'Android 14 (One UI 6.1)',
      color: 'Titanium Gray',
    },
  },
  {
    id: 'prod-6',
    storeId: 'store-2',
    categoryId: 'cat-4',
    title: 'ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB',
    slug: 'asus-rog-strix-rtx-4090-24gb',
    brand: 'ASUS',
    model: 'ROG Strix RTX 4090 OC',
    description: 'The pinnacle of desktop graphics. Patented vapor chamber, Diecast exoskeleton, Axial-tech fans scaled up for 23% more airflow.',
    price: 1849,
    originalPrice: 2099,
    condition: 'BRAND_NEW',
    status: 'AVAILABLE',
    warrantyMonths: 36,
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
    ],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    specifications: {
      gpu: 'NVIDIA GeForce RTX 4090 (24GB GDDR6X)',
      storage: '384-bit Memory Bus',
      additional: {
        cudaCores: '16384',
        boostClock: '2640 MHz',
        powerRequirement: '1000W PSU',
      },
      color: 'ROG Cyberpunk Edition',
    },
  },
  {
    id: 'prod-7',
    storeId: 'store-3',
    categoryId: 'cat-5',
    title: 'Sony Alpha 7 IV Full-Frame Mirrorless Camera (Body Only)',
    slug: 'sony-alpha-7-iv-camera-body',
    brand: 'Sony',
    model: 'ILCE-7M4',
    description: '33MP Exmor R CMOS Sensor, 4K 60p video, real-time Eye AF for human, animal and birds, S-Cinetone color profile.',
    price: 2199,
    originalPrice: 2499,
    condition: 'LIKE_NEW',
    status: 'AVAILABLE',
    warrantyMonths: 14,
    batteryHealthPct: 98,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
    ],
    isFeatured: false,
    createdAt: new Date().toISOString(),
    specifications: {
      cpu: 'BIONZ XR image processor',
      display: '3.0" vari-angle touchscreen LCD',
      additional: {
        sensor: '33MP Full-Frame Exmor R CMOS',
        video: '4K 60p 10-bit 4:2:2',
        stabilization: '5-axis in-body image stabilization (5.5 stops)',
      },
      color: 'Matte Black',
    },
  },
  {
    id: 'prod-8',
    storeId: 'store-2',
    categoryId: 'cat-3',
    title: 'Sony PlayStation 5 Slim Digital Edition (1TB SSD)',
    slug: 'sony-playstation-5-slim-1tb',
    brand: 'Sony',
    model: 'CFI-2000 Slim',
    description: 'Ultra-fast SSD, haptic feedback DualSense controller, 3D audio, slimmed down form factor.',
    price: 399,
    originalPrice: 449,
    condition: 'BRAND_NEW',
    status: 'AVAILABLE',
    warrantyMonths: 12,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop',
    ],
    isFeatured: false,
    createdAt: new Date().toISOString(),
    specifications: {
      cpu: 'x86-64 AMD Ryzen Zen 2 (8 Cores / 16 Threads)',
      gpu: 'AMD Radeon RDNA 2-based graphics engine (10.3 TFLOPS)',
      ram: '16GB GDDR6',
      storage: '1TB Custom NVMe SSD',
      color: 'Glacier White',
    },
  },
];

export const INITIAL_BOOKINGS: IBooking[] = [
  {
    id: 'book-1',
    productId: 'prod-1',
    storeId: 'store-1',
    customerName: 'Aarav Mehta',
    customerPhone: '+919822334455',
    customerEmail: 'aarav.mehta@example.com',
    bookingDate: new Date(Date.now() + 86400000).toISOString(),
    status: 'PENDING',
    notes: 'Interested in checking battery cycle count and doing benchmark test.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'book-2',
    productId: 'prod-4',
    storeId: 'store-3',
    customerName: 'Priya Sharma',
    customerPhone: '+919877001122',
    customerEmail: 'priya.s@example.com',
    bookingDate: new Date(Date.now() + 172800000).toISOString(),
    status: 'CONFIRMED',
    notes: 'Visiting store this Saturday around 4 PM.',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_ENQUIRIES: IEnquiry[] = [
  {
    id: 'enq-1',
    productId: 'prod-2',
    storeId: 'store-2',
    customerName: 'Vikram Joshi',
    customerPhone: '+919933221100',
    customerEmail: 'vikram.j@example.com',
    message: 'Can the RAM be upgraded to 64GB before pickup? What would be the price difference?',
    status: 'NEW',
    createdAt: new Date().toISOString(),
  },
];
