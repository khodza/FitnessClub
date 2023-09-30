import {
  IsNotEmpty,
  IsMongoId,
  IsPositive,
  ArrayMinSize,
  IsOptional,
  Min,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsMongoId()
  product_id: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  count: number;
}

export class CreateOrderDto {
  @IsOptional()
  user_id?: mongoose.Types.ObjectId;

  @ArrayMinSize(1)
  order_items: CreateOrderItemDto[];
}
