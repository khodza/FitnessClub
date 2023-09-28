import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from '../product-dtos/create-product.dto';
import { IsIn, IsString, IsNotEmpty } from 'class-validator';
import { Product } from '../../product.schema';

export class CreateEquipDto extends PartialType(
  OmitType(CreateProductDto, ['type']),
) {
  @IsNotEmpty()
  @IsString()
  @IsIn(['equipment'])
  type: Product;
}
