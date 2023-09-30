import { IsString } from '@nestjs/class-validator';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ID } from 'src/users/dto/id.dto';
import { ProductType } from '../../types';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  price: number;

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
  count: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['product'])
  type: ProductType;
}
