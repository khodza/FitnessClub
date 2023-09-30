import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { UsersService } from '../users/users.service';
import * as bycypt from 'bcrypt';
import { VerificationService } from './verification.service';
import { EmailService } from 'src/email.service';

@Injectable()
export class AuthService {
  private readonly log = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private verificationService: VerificationService,
    private emailService: EmailService,
  ) {}
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(
      email,
      'password email roles',
    );
    if (user && (await bycypt.compare(password, user.password))) {
      this.log.log(`Validation approved of user ${email} on logging`);
      return user;
    }
    this.log.fatal(`Validation failed of user ${email} on logging`);

    return null;
  }

  async login(user: User): Promise<string> {
    try {
      //generage verification code
      const verificationCode =
        await this.verificationService.createVerificationCode(user.email);

      // send verification code to user email
      await this.emailService.sendVerificationCodeEmail(
        user.email,
        verificationCode,
      );

      return `Verification code was sent to ${user.email}`;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  async verifyVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<string> {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const isVerified = await this.verificationService.checkVerificationCode(
        email,
        verificationCode,
      );
      if (isVerified) {
        return await this.jwtService.signAsync({
          userId: user._id,
          roles: user.roles,
        });
      }
      throw new BadRequestException('Verification code is not valid');
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }
}
