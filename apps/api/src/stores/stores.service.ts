import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { INITIAL_STORES, IStore } from '../seed/mock-data';

// Haversine formula to compute distance between two coordinates in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

@Injectable()
export class StoresService {
  private stores: IStore[] = [...INITIAL_STORES];

  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    city?: string;
    isApproved?: boolean;
    lat?: number;
    lng?: number;
    radiusKm?: number;
  }): Promise<(IStore & { distanceKm?: number })[]> {
    let result = [...this.stores];

    if (params.isApproved !== undefined) {
      result = result.filter((s) => s.isApproved === params.isApproved);
    } else {
      // By default for customer side, only show approved stores
      result = result.filter((s) => s.isApproved);
    }

    if (params.city) {
      const cityLower = params.city.toLowerCase();
      result = result.filter((s) => s.city.toLowerCase().includes(cityLower));
    }

    if (params.lat !== undefined && params.lng !== undefined) {
      const radius = params.radiusKm || 50;
      return result
        .map((store) => {
          const distanceKm =
            store.latitude && store.longitude
              ? calculateDistanceKm(params.lat!, params.lng!, store.latitude, store.longitude)
              : undefined;
          return { ...store, distanceKm };
        })
        .filter((store) => store.distanceKm === undefined || store.distanceKm <= radius)
        .sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    }

    return result;
  }

  async findOne(idOrSlug: string): Promise<IStore> {
    const store = this.stores.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
    if (!store) {
      throw new NotFoundException(`Store with ID or slug '${idOrSlug}' not found`);
    }
    return store;
  }

  async create(data: Partial<IStore>): Promise<IStore> {
    const newStore: IStore = {
      id: `store-${Date.now()}`,
      ownerId: data.ownerId || 'owner-custom',
      name: data.name || 'New Tech Store',
      slug: (data.name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
      description: data.description || '',
      logo: data.logo || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=400&fit=crop',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      postalCode: data.postalCode || '',
      latitude: data.latitude || 19.076,
      longitude: data.longitude || 72.877,
      phone: data.phone || '',
      whatsapp: (data.whatsapp || data.phone || '').replace(/\D/g, ''),
      rating: 5.0,
      isApproved: false, // Default requires Super Admin approval!
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.stores.push(newStore);
    return newStore;
  }

  async updateApproval(id: string, isApproved: boolean): Promise<IStore> {
    const store = await this.findOne(id);
    store.isApproved = isApproved;
    return store;
  }

  async updateProfile(id: string, data: Partial<IStore>): Promise<IStore> {
    const store = await this.findOne(id);
    Object.assign(store, data);
    return store;
  }

  getAllStoresForAdmin(): IStore[] {
    return this.stores;
  }
}
