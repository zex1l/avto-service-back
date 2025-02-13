import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { Authorized } from '../auth/decorators/authorizate.decorator';
import { Authorization } from '../auth/decorators/auth.decorator';
import { ProductDto } from '../product/dto/product.dto';
import { Sale } from 'prisma/generated';
import { SaleDto } from './dto/sale.dto';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @HttpCode(HttpStatus.OK)
  @Authorization('ADMIN')
  @Get('/all')
  async getAllSales() {
    return await this.saleService.getAllSales();
  }

  @HttpCode(HttpStatus.OK)
  @Authorization()
  @Get()
  async getUserSales(@Authorized('id') userId: string) {
    return await this.saleService.getUserSales(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Authorization()
  @Post()
  async createSale(
    @Authorized('id') userId: string,
    @Body()
    { products, totalCoast }: { products: SaleDto[]; totalCoast: number },
  ) {
    return await this.saleService.createSale(userId, products, totalCoast);
  }
}
