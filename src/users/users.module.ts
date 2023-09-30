import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { jwtModule } from 'src/modules/jwt.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { ImageService } from 'src/services/image.service';
import { VerificationService } from 'src/auth/verification.service';
import { EmailService } from 'src/services/email.service';
import { VerificationSchema } from 'src/auth/verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'Verification', schema: VerificationSchema },
    ]),

    jwtModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    VerificationService,
    EmailService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: 'UserImageService',
      useFactory: () => {
        return new ImageService('users');
      },
    },
  ],
  exports: [UsersService, 'UserImageService'],
})
export class UsersModule {}
