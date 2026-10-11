import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('store-stats/:storeId')
  @ApiOperation({ summary: 'Get store owner dashboard analytics' })
  async getStoreStats(@Param('storeId') storeId: string) {
    return this.adminService.getStoreStats(storeId);
  }

  @Get('platform-stats')
  @ApiOperation({ summary: 'Get super admin platform-wide statistics' })
  async getPlatformStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('stores/all')
  @ApiOperation({ summary: 'Get all stores including pending approval (Super Admin)' })
  async getAllStores() {
    return this.adminService.getAllStores();
  }

  @Patch('stores/:id/approval')
  @ApiOperation({ summary: 'Approve or reject a store registration (Super Admin)' })
  async setStoreApproval(
    @Param('id') id: string,
    @Body('isApproved') isApproved: boolean,
  ) {
    return this.adminService.setStoreApproval(id, isApproved);
  }
}
