// order.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order } from './orders.schema';
import { ProductsService } from 'src/product/product.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly productService: ProductsService,
  ) {}

  async createOrders(createOrderDto: CreateOrderDto): Promise<Order[]> {
    const { user_id, order_items } = createOrderDto;
    const createdOrders: Order[] = [];

    for (const orderItem of order_items) {
      const { product_id, count } = orderItem;

      // Find the product by ID
      const existingProduct = await this.productService.findProduct(product_id);

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${product_id} not found`);
      }

      // Calculate the total price
      const total_price = existingProduct.price * count;

      // Check if there are enough products in stock
      if (existingProduct.count < count) {
        throw new Error(`Not enough stock for product with ID ${product_id}`);
      }

      // Decrement the product count
      existingProduct.count -= count;
      await existingProduct.save();

      // Create the order
      const createdOrder = new this.orderModel({
        user: user_id,
        product: product_id,
        count,
        total_price,
      });

      createdOrders.push(await createdOrder.save());
    }

    return createdOrders;
  }

  //get user orders

  async findOrdersByUser(user_id: mongoose.Types.ObjectId): Promise<Order[]> {
    const orders = await this.orderModel
      .find({ user: user_id })
      .populate(['product'])
      .exec();

    return orders;
  }

  //get all orders
  async findAllOrders(): Promise<Order[]> {
    const orders = await this.orderModel
      .find()
      .populate(['product', 'user'])
      .exec();

    return orders;
  }

  async findOrder(order_id: mongoose.Types.ObjectId): Promise<Order> {
    const order = await this.orderModel
      .findById(order_id)
      .populate(['product', 'user'])
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${order_id} not found`);
    }

    return order;
  }

  async removeOrder(order_id: mongoose.Types.ObjectId): Promise<any> {
    const order = await this.orderModel.findById(order_id).exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${order_id} not found`);
    }

    const { product, count } = order;

    // Increment the product count
    const existingProduct = await this.productService.findProduct(product);
    existingProduct.count += count;
    await existingProduct.save();

    await order.deleteOne();
    return { message: 'Order deleted successfully' };
  }

  async removeManyOrders(order_ids: mongoose.Types.ObjectId[]): Promise<any> {
    const orders = await this.orderModel.find({ _id: { $in: order_ids } });

    if (!orders) {
      throw new NotFoundException(`Orders not found`);
    }

    for (const order of orders) {
      const { product, count } = order;

      // Increment the product count
      const existingProduct = await this.productService.findProduct(product);
      existingProduct.count += count;
      await existingProduct.save();

      await order.deleteOne();
    }

    return { message: 'Orders deleted successfully' };
  }

  // Rest of the service methods...
}
