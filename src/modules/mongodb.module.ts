import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongoDB');

        const mongooseOptions = {
          uri: configService.get<string>('DB'),
        };

        const connection = mongoose.createConnection(mongooseOptions.uri);

        connection.on('connected', () => {
          logger.log('MongoDB connection opened');
        });

        connection.on('error', (error) => {
          logger.error('MongoDB connection error', error);
        });

        connection.on('disconnected', () => {
          logger.log('MongoDB connection closed');
        });

        return mongooseOptions;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDbModule {}
