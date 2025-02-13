import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [CartController],
  providers: [CartService, ProductService, UserService],
})
export class CartModule {}
