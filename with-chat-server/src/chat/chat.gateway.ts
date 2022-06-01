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

  wsClients = [];
  handleConnection(client: Socket) {
    this.wsClients.push(client);
  }

  @SubscribeMessage('join')
  connectSomeone(@MessageBody() data: string) {
    const [user, channelId] = data;
    console.log(`${user}님이 코드: ${channelId}방에 접속했습니다.`);
    const comeOn = `${user}님이 입장했습니다.`;
    this.server.emit('comeOn' + channelId, comeOn);
  }

  getClient(@ConnectedSocket() client: Socket) {
    return client;
  }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const [room, nickname, message] = data;
    console.log(`${client.id} : ${data}`);
    console.log('broadcast.emit');
    client.broadcast.emit(room, [nickname, message]);
  }
}
