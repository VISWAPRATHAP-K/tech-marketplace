import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { StoresService } from '../stores/stores.service';
import { INITIAL_BOOKINGS, IBooking } from '../seed/mock-data';

@Injectable()
export class BookingsService {
  private bookings: IBooking[] = [...INITIAL_BOOKINGS];

  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly storesService: StoresService,
  ) {}

  async findAll(params: { storeId?: string; customerPhone?: string }): Promise<IBooking[]> {
    let list = [...this.bookings];

    if (params.storeId) {
      list = list.filter((b) => b.storeId === params.storeId);
    }

    if (params.customerPhone) {
      list = list.filter((b) => b.customerPhone.includes(params.customerPhone!));
    }

    return list.map((b) => this.attachMeta(b));
  }

  async findOne(id: string): Promise<IBooking> {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return this.attachMeta(booking);
  }

  async create(data: Partial<IBooking>): Promise<IBooking> {
    const newBooking: IBooking = {
      id: `book-${Date.now().toString().slice(-6)}`,
      productId: data.productId || '',
      storeId: data.storeId || '',
      customerName: data.customerName || 'Anonymous Customer',
      customerPhone: data.customerPhone || '',
      customerEmail: data.customerEmail || '',
      bookingDate: data.bookingDate || new Date(Date.now() + 86400000).toISOString(),
      status: 'PENDING',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    return this.attachMeta(newBooking);
  }

  async updateStatus(
    id: string,
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED',
  ): Promise<IBooking> {
    const booking = await this.findOne(id);
    booking.status = status;

    // If booking is confirmed, optionally mark product as RESERVED
    if (status === 'CONFIRMED' && booking.productId) {
      try {
        await this.productsService.update(booking.productId, { status: 'RESERVED' });
      } catch (err) {
        // ignore if not found
      }
    }

    return booking;
  }

  private attachMeta(booking: IBooking): IBooking {
    return {
      ...booking,
    };
  }
}
