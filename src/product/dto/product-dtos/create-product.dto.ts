import { IsString } from '@nestjs/class-validator';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ID } from 'src/users/dto/id.dto';
import { ProductType } from '../../types';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number = 5000;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  information: string;

  @IsNotEmpty()
  @IsString()
  category: ID;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  count: number = 10;

  @IsNotEmpty()
  @IsString()
  @IsIn(['product'])
  type: ProductType;
}
