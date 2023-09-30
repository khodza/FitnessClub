import { IsArray } from 'class-validator';
import * as mongoose from 'mongoose';

export class DeleteProductsDto {
  @IsArray()
  products: mongoose.Types.ObjectId[];
}
