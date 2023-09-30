import { IsEmail, IsString } from 'class-validator';

export class VeryfyDto {
  @IsEmail()
  email: string;

  @IsString()
  verificationCode: string;
}
