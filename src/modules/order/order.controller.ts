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
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Authorization } from '../auth/decorators/auth.decorator';
import { UserRoles } from 'prisma/generated';
import { OrderDto, UpdateOrderDto } from './dto/order.dto';
import { Authorized } from '../auth/decorators/authorizate.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Authorization(UserRoles.ADMIN)
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getOrders(
    @Query('')
    { date, name, status }: { date?: string; name?: string; status?: string },
  ) {
    return await this.orderService.getOrders(date, name, status);
  }

  @Authorization()
  @Post('')
  @HttpCode(HttpStatus.OK)
  async createOrder(
    @Authorized('id') userID: string,
    @Body() orderDto: OrderDto,
  ) {
    return await this.orderService.createOrder(userID, orderDto);
  }

  @Authorization('ADMIN')
  @Put('')
  @HttpCode(HttpStatus.OK)
  async updateOrder(@Body() orderDto: UpdateOrderDto) {
    return await this.orderService.updateOrder(orderDto);
  }

  @Authorization('ADMIN')
  @Get('current/:id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  @Authorization()
  @Delete('')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(
    @Authorized('id') userID: string,
    @Body() { id }: { id: string },
  ) {
    return await this.orderService.deleteOrder(userID, id);
  }

  @Authorization()
  @Get('user')
  @HttpCode(HttpStatus.OK)
  async getUserOrder(
    @Authorized('id') userId: string,
    @Query('status') status?: string,
  ) {
    return await this.orderService.getUserOrders(userId, status);
  }
}
