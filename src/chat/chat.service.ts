import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMessageDto, Message } from './rooms/dto/create-room.dto';

@Injectable()
export class ChatService {
  messages: Message[] = [{ name: 'Izzat', message: 'Hi' }];
  clientToUser = {};

  create(createChatDto: CreateMessageDto) {
    const message = { ...createChatDto };
    this.messages.push(createChatDto);
    return message;
  }

  findAll() {
    return this.messages;
  }

  identifyUser(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  getClientByName(clientId: string) {
    return this.clientToUser[clientId];
  }
}
