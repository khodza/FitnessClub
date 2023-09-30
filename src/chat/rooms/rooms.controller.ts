import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './rooms.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    const room = await this.roomService.createRoom(createRoomDto);
    return {
      message: 'Room created successfully',
      room,
    };
  }

  @Delete(':id')
  async deleteRoom(@Param('id') roomId: string) {
    await this.roomService.deleteRoom(roomId);
    return {
      message: 'Room deleted successfully',
    };
  }
}
