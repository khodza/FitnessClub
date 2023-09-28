import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsIn, IsString, IsNotEmpty } from 'class-validator';
import { Product } from '../../product.schema';
import { CreateProductCategoryDto } from '../product-dtos/create-product-category.dto';

export class CreateEquipCategoryDto extends PartialType(
  OmitType(CreateProductCategoryDto, ['type']),
) {
  @IsNotEmpty()
  @IsString()
  @IsIn(['equipment'])
  type: Product;
}
