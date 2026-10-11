import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { StoresModule } from '../stores/stores.module';
import { ProductsModule } from '../products/products.module';
import { BookingsModule } from '../bookings/bookings.module';
import { EnquiriesModule } from '../enquiries/enquiries.module';

@Module({
  imports: [StoresModule, ProductsModule, BookingsModule, EnquiriesModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
