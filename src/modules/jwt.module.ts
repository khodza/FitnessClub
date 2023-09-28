import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('JWT');

        const jwtSecret = configService.get<string>('JWT_SECRET');
        logger.log(`JWT Module initialized`);
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: parseInt(configService.get<string>('JWT_EXPIRES')),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class jwtModule {}
