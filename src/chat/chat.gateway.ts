import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
// import { Room } from './rooms/room.schema';
import { CreateMessageDto, Message } from './rooms/dto/create-room.dto';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() wss: Server;

  //LifeCycle
  afterInit() {
    this.logger.log('Initiniated');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  //Events

  @SubscribeMessage('createMessage')
  create(@MessageBody() createChatDto: CreateMessageDto) {
    const message = this.chatService.create(createChatDto);
    this.wss.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.identifyUser(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = this.chatService.getClientByName(client.id);
    client.broadcast.emit('typing', { name, isTyping });
  }
}
