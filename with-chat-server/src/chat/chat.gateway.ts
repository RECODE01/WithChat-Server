import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
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

  @WebSocketServer()
  client: Socket;

  wsClients = [];
  handleConnection(client: Socket) {
    this.wsClients.push(client);
  }

  @SubscribeMessage('join')
  connectSomeone(@MessageBody() data: string) {
    const [nickname, room] = data;
    console.log(`${nickname}님이 코드: ${room}방에 접속했습니다.`);
    const comeOn = `${nickname}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn);
  }

  // @SubscribeMessage('send')
  // sendMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  //   const [room, nickname, message] = data;
  //   console.log(`${client.id} : ${data}`);
  //   client.broadcast.emit(room, [nickname, message]);
  // }
}
