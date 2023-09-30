// verification-code.service.ts

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Verification } from './verification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VerificationService {
  private readonly log = new Logger(VerificationService.name);
  constructor(
    @InjectModel(Verification.name)
    private readonly verificationModel: Model<Verification>,
    private readonly usersService: UsersService,
  ) {}

  async createVerificationCode(email: string): Promise<string> {
    try {
      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // Generate a random verification code (you can use a code generation library)
      const code = this.generateRandomCode(6);

      // Set the expiration time (e.g., 10 minutes from now)
      const expire_time = new Date();
      expire_time.setMinutes(expire_time.getMinutes() + 10);

      // Create a verification code record
      const verificationCode = this.verificationModel.create({
        email,
        code,
        expire_time,
      });

      return (await verificationCode).code;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  async checkVerificationCode(email: string, code: string): Promise<boolean> {
    const verificationCode = await this.verificationModel.findOne({
      email,
      code,
      expire_time: { $gte: new Date() }, // Check if the code has not expired
    });

    return !!verificationCode;
  }

  private generateRandomCode(length): string {
    const characters =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }
}
