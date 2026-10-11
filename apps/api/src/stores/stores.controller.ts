import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StoresService } from './stores.service';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'List approved stores with optional location filtering' })
  async getStores(
    @Query('city') city?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.storesService.findAll({
      city,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      radiusKm: radiusKm ? parseFloat(radiusKm) : undefined,
    });
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get store details by ID or slug' })
  async getStore(@Param('idOrSlug') idOrSlug: string) {
    return this.storesService.findOne(idOrSlug);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new store (pending approval)' })
  async createStore(@Body() body: any) {
    return this.storesService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store profile' })
  async updateStore(@Param('id') id: string, @Body() body: any) {
    return this.storesService.updateProfile(id, body);
  }
}
