import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Main (main.ts))');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // const clientPort = configService.get('CLIENT_PORT');

  // app.enableCors({
  //   origin: [
  //     `http://localhost:${clientPort}`,
  //     new RegExp(`^http://192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$`),
  //   ],
  // });

  const port = parseInt(configService.get('PORT')) || 8080;
  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
