import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  connectSomeone(@MessageBody() data) {
    const [user, channelId] = data;
    const comeOn = `${user}님이 입장했습니다.`;
    this.server.emit('comeOn' + channelId, comeOn);
  }

  getClient(@ConnectedSocket() client: Socket) {
    return client;
  }

  @SubscribeMessage('message')
  sendMessage2(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(data);
  }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const [user, channelId, contents] = data;
    client.broadcast.emit('message' + channelId, [user, contents]);
  }
}
