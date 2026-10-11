import { Injectable } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { ProductsService } from '../products/products.service';
import { BookingsService } from '../bookings/bookings.service';
import { EnquiriesService } from '../enquiries/enquiries.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly storesService: StoresService,
    private readonly productsService: ProductsService,
    private readonly bookingsService: BookingsService,
    private readonly enquiriesService: EnquiriesService,
  ) {}

  async getStoreStats(storeId: string) {
    const products = await this.productsService.findAll({ storeId });
    const bookings = await this.bookingsService.findAll({ storeId });
    const enquiries = await this.enquiriesService.findAll(storeId);

    const available = products.filter((p) => p.status === 'AVAILABLE').length;
    const reserved = products.filter((p) => p.status === 'RESERVED').length;
    const sold = products.filter((p) => p.status === 'SOLD').length;
    const totalInventoryValue = products.reduce((acc, p) => acc + p.price, 0);

    const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;

    return {
      storeId,
      productsCount: products.length,
      availableCount: available,
      reservedCount: reserved,
      soldCount: sold,
      inventoryValue: Math.round(totalInventoryValue),
      bookingsCount: bookings.length,
      pendingBookings,
      confirmedBookings,
      enquiriesCount: enquiries.length,
    };
  }

  async getPlatformStats() {
    const allStores = this.storesService.getAllStoresForAdmin();
    const allProducts = await this.productsService.findAll();
    const allBookings = await this.bookingsService.findAll({});
    const allEnquiries = await this.enquiriesService.findAll();

    const approvedStores = allStores.filter((s) => s.isApproved).length;
    const pendingStores = allStores.filter((s) => !s.isApproved).length;

    return {
      totalStores: allStores.length,
      approvedStores,
      pendingStores,
      totalListings: allProducts.length,
      totalBookings: allBookings.length,
      totalEnquiries: allEnquiries.length,
      totalGrossMerchandiseValue: Math.round(
        allProducts.reduce((acc, p) => acc + p.price, 0),
      ),
    };
  }

  async getAllStores() {
    return this.storesService.getAllStoresForAdmin();
  }

  async setStoreApproval(storeId: string, isApproved: boolean) {
    return this.storesService.updateApproval(storeId, isApproved);
  }
}
