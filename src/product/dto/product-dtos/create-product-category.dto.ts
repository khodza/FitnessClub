import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ProductType } from 'src/product/types';

export class CreateProductCategoryDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['product'])
  type: ProductType;
}
