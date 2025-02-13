import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async getCart(userId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!cart) return this.createCart(userId);

    return cart;
  }

  async addProductToCart(userId: string, productId: string, quantity: number) {
    // Если нет корзины, создает ее
    const cart = await this.createCart(userId);

    const product = await this.productService.getProductById(productId);

    if (!product) throw new NotFoundException('Товар не найден');

    const cartItem = await this.prismaService.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (!cartItem) {
      await this.prismaService.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1,
          price: product.price,
        },
      });
    } else {
      const quantityItem = cartItem.quantity + 1;
      const priceItem = cartItem.price + product.price;

      await this.prismaService.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: {
          quantity: quantityItem,
          price: priceItem,
        },
      });
    }

    await this.updateCartTotals(cart.id);

    return;
  }

  async removeItemFromCart(userId: string, productId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });
    if (!cart) throw new NotFoundException('Корзина не найдена');
    console.log(productId);
    const cartItem = await this.prismaService.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    const product = await this.productService.getProductById(productId);

    if (!cartItem || !product) throw new NotFoundException('Товар не найдена');

    if (cartItem.quantity === 1) {
      await this.prismaService.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
    } else {
      const quantityItem = cartItem.quantity - 1;
      const priceItem = cartItem.price - product.price;

      await this.prismaService.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: {
          quantity: quantityItem,
          price: priceItem,
        },
      });
    }

    await this.updateCartTotals(cart.id);
  }

  async clearCart(userId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });
    if (!cart) throw new Error('Cart not found');

    await this.prismaService.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    await this.prismaService.cart.update({
      where: { id: cart.id },
      data: { totalQuantity: 0, totalPrice: 0 },
    });
  }

  private async updateCartTotals(cartId: string) {
    const items = await this.prismaService.cartItem.findMany({
      where: { cartId },
    });

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    await this.prismaService.cart.update({
      where: { id: cartId },
      data: { totalQuantity, totalPrice },
    });
  }

  private async createCart(userId: string) {
    return await this.prismaService.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: { userId },
    });
  }
}
