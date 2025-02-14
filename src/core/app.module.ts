import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { OrderModule } from 'src/modules/order/order.module';
import { FilesModule } from 'src/modules/files/files.module';
import { ProductModule } from 'src/modules/product/product.module';
import { CartModule } from 'src/modules/cart/cart.module';
import { SaleModule } from 'src/modules/sale/sale.module';
import { IS_DEV_ENV } from 'src/libs/utils/isDev';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    OrderModule,
    FilesModule,
    ProductModule,
    CartModule,
    SaleModule,
  ],
})
export class AppModule {}
