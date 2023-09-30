import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoomDto {
  @IsMongoId()
  admin: mongoose.Types.ObjectId;

  @IsMongoId()
  user: mongoose.Types.ObjectId;
}

export class Message {
  name: string;
  message: string;
}

export class CreateMessageDto extends Message {}
