import { IsString, IsEmail, IsMongoId } from '@nestjs/class-validator';
import { Transform } from '@nestjs/class-transformer';

import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  birth_date: Date;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  service_price: string;

  @IsNotEmpty()
  @IsPhoneNumber('UZ', { message: 'Provide valid phone number' })
  phone_number: number;

  @IsNotEmpty()
  @IsMongoId({ message: `Invalid Id` })
  teacher_id: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'Provide valid email' })
  email: string;
}
