import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './orders.schema';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
