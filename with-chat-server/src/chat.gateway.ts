import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  @SubscribeMessage('hihi')
  connectSomeone(@MessageBody() data: string) {
    const [nickname, room] = data;
    console.log(`${nickname}님이 코드: ${room}방에 접속했습니다.`);
    const comeOn = `${nickname}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn);
  }

  // private broadcast(event, client, message: any) {
  //   for (const c of this.wsClients) {
  //     if (client.id == c.id) continue;
  //     c.emit(event, message);
  //   }
  // }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const [room, nickname, message] = data;
    console.log(`${client.id} : ${data}`);
    client.broadcast.emit(room, [nickname, message]);
  }
}
