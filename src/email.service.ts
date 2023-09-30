// email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Initialize the email transporter (replace with your email provider's configuration)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fitnessclubnajot@gmail.com',
        pass: 'yrnq pzoh phkb lshm',
      },
    });
  }

  async sendVerificationCodeEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: 'fitnessclubnajot@gmail.com',
      to: 'khodzapro@gmail.com',
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
