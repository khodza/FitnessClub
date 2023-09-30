import { Module } from '@nestjs/common';
import { RoomController } from './rooms.controller';
import { RoomService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './room.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomsModule {}
