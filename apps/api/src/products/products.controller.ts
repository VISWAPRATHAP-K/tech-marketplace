import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService, FilterProductsDto } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List all product categories' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get()
  @ApiOperation({ summary: 'List and filter products with search and specs' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'condition', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'cpu', required: false })
  @ApiQuery({ name: 'gpu', required: false })
  @ApiQuery({ name: 'ram', required: false })
  @ApiQuery({ name: 'storage', required: false })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isFeatured', required: false })
  async getProducts(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('condition') condition?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('cpu') cpu?: string,
    @Query('gpu') gpu?: string,
    @Query('ram') ram?: string,
    @Query('storage') storage?: string,
    @Query('storeId') storeId?: string,
    @Query('status') status?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    const filters: FilterProductsDto = {
      search,
      category,
      brand,
      condition,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      cpu,
      gpu,
      ram,
      storage,
      storeId,
      status,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
    };
    return this.productsService.findAll(filters);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare multiple products side by side' })
  async compareProducts(@Query('ids') ids: string) {
    const productIds = (ids || '').split(',').map((id) => id.trim()).filter(Boolean);
    return this.productsService.compare(productIds);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get product details by ID or slug' })
  async getProduct(@Param('idOrSlug') idOrSlug: string) {
    return this.productsService.findOne(idOrSlug);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new product with specifications (Store Owner)' })
  async createProduct(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product details, specs or status' })
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
