import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongoDbModule } from './modules/mongodb.module';
import { APP_PIPE } from '@nestjs/core';
import { TeachersModule } from './teachers/teachers.module';
import { ProductsModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongoDbModule,
    UsersModule,
    TeachersModule,
    ProductsModule,
    OrdersModule,
    ChatModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
