import { Injectable, NotFoundException } from '@nestjs/common';
import { INITIAL_ENQUIRIES, IEnquiry } from '../seed/mock-data';

@Injectable()
export class EnquiriesService {
  private enquiries: IEnquiry[] = [...INITIAL_ENQUIRIES];

  async findAll(storeId?: string): Promise<IEnquiry[]> {
    if (storeId) {
      return this.enquiries.filter((e) => e.storeId === storeId);
    }
    return this.enquiries;
  }

  async create(data: Partial<IEnquiry>): Promise<IEnquiry> {
    const newEnquiry: IEnquiry = {
      id: `enq-${Date.now().toString().slice(-6)}`,
      productId: data.productId,
      storeId: data.storeId || 'store-1',
      customerName: data.customerName || 'Anonymous Customer',
      customerPhone: data.customerPhone || '',
      customerEmail: data.customerEmail,
      message: data.message || '',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    this.enquiries.unshift(newEnquiry);
    return newEnquiry;
  }

  async updateStatus(id: string, status: 'NEW' | 'CONTACTED' | 'RESOLVED'): Promise<IEnquiry> {
    const enq = this.enquiries.find((e) => e.id === id);
    if (!enq) {
      throw new NotFoundException(`Enquiry ${id} not found`);
    }
    enq.status = status;
    return enq;
  }
}
