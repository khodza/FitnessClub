import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  BadRequestException,
  Request,
  Logger,
  UseGuards,
  Param,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import mongoose from 'mongoose';
import { ID } from 'src/users/dto/id.dto';
import { DeleteOrdersDto } from './dto/delete-order.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role.auth.guard';

@Controller('orders')
export class OrderController {
  private readonly log = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<any> {
    try {
      const userId = req.user.userId as mongoose.Types.ObjectId;
      createOrderDto.user_id = userId;
      const createdOrder = await this.orderService.createOrders(createOrderDto);
      return { message: 'Order created successfully', order: createdOrder };
    } catch (error) {
      this.log.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid order request');
    }
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async findAllOrders(): Promise<any> {
    return this.orderService.findAllOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('myorders')
  async findOrdersByUser(@Request() req): Promise<any> {
    return this.orderService.findOrdersByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOrder(@Param() params: ID): Promise<any> {
    return this.orderService.findOrder(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeOrder(@Param() params: ID): Promise<any> {
    return this.orderService.removeOrder(params.id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete()
  async removeManyOrders(@Body() body: DeleteOrdersDto): Promise<any> {
    return this.orderService.removeManyOrders(body.orders);
  }
}
