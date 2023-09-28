import { IsMongoId } from '@nestjs/class-validator';
import * as mongoose from 'mongoose';

export class ID {
  @IsMongoId({ message: `Invalid Id` })
  readonly id: mongoose.Types.ObjectId;
}
