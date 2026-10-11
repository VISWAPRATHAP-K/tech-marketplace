import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'List bookings filtered by storeId or customer phone' })
  async getBookings(
    @Query('storeId') storeId?: string,
    @Query('phone') phone?: string,
  ) {
    return this.bookingsService.findAll({ storeId, customerPhone: phone });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID' })
  async getBooking(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Reserve a product before visiting store (Book Now)' })
  async createBooking(@Body() body: any) {
    return this.bookingsService.create(body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status (Confirm, Reject, Complete, Cancel)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED',
  ) {
    return this.bookingsService.updateStatus(id, status);
  }
}
