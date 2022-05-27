import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(80, {
  cors: {
    origin: ['http://localhost:3000/'],
  },
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('a');
  }
  handleError(clicen: Socket) {
    console.log('aaa');
  }
  handleDisconnect(client: Socket) {}

  @SubscribeMessage('hihi')
  connectSomeone(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('연결');
    const [nickname, room] = data;
    console.log(`${nickname}님이 코드: ${room}방에 접속했습니다.`);
    const comeOn = `${nickname}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn);
  }

  private broadcast(event, client, message: any) {
    for (const id in this.server.sockets)
      if (id !== client.id) this.server.sockets[id].emit(event, message);
  }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client) {
    const [room, nickname, message] = data;
    console.log(`${client.id} : ${data}`);
    this.broadcast(room, client, [nickname, message]);
  }
}
