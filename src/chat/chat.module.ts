import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [RoomsModule, UsersModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
