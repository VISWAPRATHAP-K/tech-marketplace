import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoresService } from '../stores/stores.service';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, IProduct, ICategory } from '../seed/mock-data';

export interface FilterProductsDto {
  search?: string;
  category?: string; // slug or id
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  storeId?: string;
  status?: string;
  isFeatured?: boolean;
}

@Injectable()
export class ProductsService {
  private products: IProduct[] = [...INITIAL_PRODUCTS];
  private categories: ICategory[] = [...INITIAL_CATEGORIES];

  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService,
  ) {}

  getCategories(): ICategory[] {
    return this.categories;
  }

  async findAll(filters: FilterProductsDto = {}): Promise<IProduct[]> {
    let list = [...this.products];

    // Search by name, model, brand, description
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.specifications.cpu && p.specifications.cpu.toLowerCase().includes(q)) ||
          (p.specifications.gpu && p.specifications.gpu.toLowerCase().includes(q)),
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      const cat = this.categories.find(
        (c) => c.slug === filters.category || c.id === filters.category,
      );
      if (cat) {
        list = list.filter((p) => p.categoryId === cat.id);
      }
    }

    // Brand filter
    if (filters.brand) {
      const b = filters.brand.toLowerCase();
      list = list.filter((p) => p.brand.toLowerCase() === b);
    }

    // Condition filter
    if (filters.condition && filters.condition !== 'ALL') {
      list = list.filter((p) => p.condition === filters.condition);
    }

    // Status filter
    if (filters.status) {
      list = list.filter((p) => p.status === filters.status);
    }

    // Store ID filter
    if (filters.storeId) {
      list = list.filter((p) => p.storeId === filters.storeId);
    }

    // Price range
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    // Tech specs filters
    if (filters.cpu) {
      const cpuTerm = filters.cpu.toLowerCase();
      list = list.filter(
        (p) => p.specifications.cpu && p.specifications.cpu.toLowerCase().includes(cpuTerm),
      );
    }

    if (filters.gpu) {
      const gpuTerm = filters.gpu.toLowerCase();
      list = list.filter(
        (p) => p.specifications.gpu && p.specifications.gpu.toLowerCase().includes(gpuTerm),
      );
    }

    if (filters.ram) {
      const ramTerm = filters.ram.toLowerCase();
      list = list.filter(
        (p) => p.specifications.ram && p.specifications.ram.toLowerCase().includes(ramTerm),
      );
    }

    if (filters.storage) {
      const storageTerm = filters.storage.toLowerCase();
      list = list.filter(
        (p) => p.specifications.storage && p.specifications.storage.toLowerCase().includes(storageTerm),
      );
    }

    if (filters.isFeatured !== undefined) {
      list = list.filter((p) => p.isFeatured === filters.isFeatured);
    }

    // Attach store and category metadata
    return list.map((prod) => this.attachMeta(prod));
  }

  async findOne(idOrSlug: string): Promise<IProduct> {
    const product = this.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) {
      throw new NotFoundException(`Product '${idOrSlug}' not found`);
    }
    return this.attachMeta(product);
  }

  async compare(productIds: string[]): Promise<IProduct[]> {
    const list = this.products.filter((p) => productIds.includes(p.id));
    return list.map((prod) => this.attachMeta(prod));
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    const newProduct: IProduct = {
      id: `prod-${Date.now()}`,
      storeId: data.storeId || 'store-1',
      categoryId: data.categoryId || 'cat-1',
      title: data.title || 'Untitled Device',
      slug: (data.title || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
      brand: data.brand || 'Generic',
      model: data.model || 'Standard',
      description: data.description || '',
      price: Number(data.price) || 0,
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      condition: data.condition || 'BRAND_NEW',
      status: data.status || 'AVAILABLE',
      warrantyMonths: Number(data.warrantyMonths) || 12,
      batteryHealthPct: data.batteryHealthPct ? Number(data.batteryHealthPct) : undefined,
      images: data.images?.length ? data.images : ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop'],
      isFeatured: !!data.isFeatured,
      createdAt: new Date().toISOString(),
      specifications: data.specifications || {},
    };

    this.products.unshift(newProduct);
    return this.attachMeta(newProduct);
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.products[index] = {
      ...this.products[index],
      ...data,
      specifications: {
        ...this.products[index].specifications,
        ...(data.specifications || {}),
      },
    };

    return this.attachMeta(this.products[index]);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
    return { success: true };
  }

  private attachMeta(prod: IProduct): IProduct {
    const store = this.storesService.getAllStoresForAdmin().find((s) => s.id === prod.storeId);
    const category = this.categories.find((c) => c.id === prod.categoryId);
    return {
      ...prod,
      store: store ? { id: store.id, name: store.name, slug: store.slug, city: store.city, phone: store.phone, whatsapp: store.whatsapp, rating: store.rating } : undefined,
      category: category ? { id: category.id, name: category.name, slug: category.slug, icon: category.icon } : undefined,
    };
  }
}
