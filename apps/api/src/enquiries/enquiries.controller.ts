import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EnquiriesService } from './enquiries.service';

@ApiTags('enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Get()
  @ApiOperation({ summary: 'List customer enquiries for a store' })
  async getEnquiries(@Query('storeId') storeId?: string) {
    return this.enquiriesService.findAll(storeId);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a customer enquiry / ask a question' })
  async createEnquiry(@Body() body: any) {
    return this.enquiriesService.create(body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update enquiry status (NEW, CONTACTED, RESOLVED)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'NEW' | 'CONTACTED' | 'RESOLVED',
  ) {
    return this.enquiriesService.updateStatus(id, status);
  }
}
