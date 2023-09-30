import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Main (main.ts))');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  const port = parseInt(configService.get('PORT')) || 8080;
  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
