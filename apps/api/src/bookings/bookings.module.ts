import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ProductsModule } from '../products/products.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [ProductsModule, StoresModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
