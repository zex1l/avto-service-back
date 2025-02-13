import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { OrderDto, UpdateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getOrders(date?: string, name?: string, status?: string) {
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);

      where.visitDate = {
        gte: startDate.toISOString(),
        lt: endDate.toISOString(),
      };
    }

    if (status) {
      where.status = { contains: status };
    }

    const orders = await this.prismaService.order.findMany({ where });

    return orders;
  }

  public async createOrder(
    userId: string,
    { name, number, status, type, visitDate }: OrderDto,
  ) {
    await this.prismaService.order.create({
      data: {
        name,
        number,
        status,
        type,
        visitDate: visitDate,
        userId,
      },
    });

    return true;
  }

  public async deleteOrder(userID: string, id: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (order.userId !== userID)
      throw new Error('У вас нет доступа к данному заказу');

    await this.prismaService.order.delete({ where: { id } });

    return true;
  }

  public async getOrderByDate(date: string) {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    return await this.prismaService.order.findMany({
      where: {
        visitDate: {
          gte: startDate.toISOString(),
          lt: endDate.toISOString(),
        },
      },
    });
  }

  public async getOrderByStatus(userId: string, status: string) {
    if (userId === null)
      return await this.prismaService.order.findMany({ where: { status } });

    return await this.prismaService.order.findMany({
      where: { status, userId },
    });
  }

  public async updateOrder({
    name,
    number,
    status,
    type,
    visitDate,
    id,
  }: UpdateOrderDto) {
    return await this.prismaService.order.update({
      where: { id },
      data: {
        name,
        number,
        status,
        type,
        visitDate,
        updatedAt: new Date(),
      },
    });
  }

  async getOrderById(id: string) {
    return await this.prismaService.order.findUnique({ where: { id } });
  }

  async getUserOrders(userId: string, status?: string) {
    return await this.prismaService.order.findMany({
      where: { userId, status },
    });
  }
}
