import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [SaleController],
  providers: [SaleService, UserService],
})
export class SaleModule {}
