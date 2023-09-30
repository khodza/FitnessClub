import { IsArray } from 'class-validator';
import * as mongoose from 'mongoose';

export class DeleteOrdersDto {
  @IsArray()
  orders: mongoose.Types.ObjectId[];
}
