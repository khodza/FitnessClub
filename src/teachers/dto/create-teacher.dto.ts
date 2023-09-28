import { IsString, IsEmail } from '@nestjs/class-validator';
import { Transform } from '@nestjs/class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn([1, 2, 3, 4])
  degree: number;

  @IsNotEmpty()
  @IsPhoneNumber('UZ', { message: 'Provide valid phone number' })
  phone_number: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNotEmpty({ message: 'Provide information about teacher' })
  @IsString()
  information: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['man', 'woman'])
  gender: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['even', 'odd'])
  work_days: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'Provide valid email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  birth_date: Date;
}
