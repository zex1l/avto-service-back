import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Authorization } from '../auth/decorators/auth.decorator';
import { Authorized } from '../auth/decorators/authorizate.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getCart(@Authorized('id') userId: string) {
    return await this.cartService.getCart(userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post('add')
  async addProductToCart(
    @Authorized('id') userId: string,
    @Body() { productId, quentity }: { productId: string; quentity: number },
  ) {
    return await this.cartService.addProductToCart(userId, productId, quentity);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post('remove')
  async removeProductToCart(
    @Authorized('id') userId: string,
    @Body() { productId }: { productId: string },
  ) {
    return await this.cartService.removeItemFromCart(userId, productId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Delete('')
  async clearCart(@Authorized('id') userId: string) {
    return await this.cartService.clearCart(userId);
  }
}
