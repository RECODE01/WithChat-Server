import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelHistoryService } from 'src/apis/channel-history/channel-history.service';

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

  // constructor(private readonly channelHistoryService: ChannelHistoryService) {}
  @SubscribeMessage('join')
  connectSomeone(@MessageBody() data: string) {
    const [nickname, room] = data;
    console.log(`${nickname}님이 코드: ${room}방에 접속했습니다.`);
    const comeOn = `${nickname}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn);
  }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const [room, nickname, message] = data;
    console.log(`${client.id} : ${data}`);
    client.broadcast.emit(room, [nickname, message]);
    // this.channelHistoryService.createChannelHistory(
    //   message,
    //   client.id,
    //   nickname,
    // );
  }
}
