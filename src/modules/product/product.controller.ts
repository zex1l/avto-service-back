import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { Authorization } from '../auth/decorators/auth.decorator';
import { UserRoles } from 'prisma/generated';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Authorization(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Post('')
  async create(@Body() productDto: ProductDto) {
    return await this.productService.create(productDto);
  }

  @Authorization(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(@Param('id') id: string, @Body() productDto: ProductDto) {
    return await this.productService.update(id, productDto);
  }

  @Authorization(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
