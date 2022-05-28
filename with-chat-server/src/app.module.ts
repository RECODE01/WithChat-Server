import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './apis/auth/auth.module';
import { UsersModule } from './apis/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendModule } from './apis/friend/friend.module';
import { FriendRequestModule } from './apis/friend-request/friend-request.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './apis/file/file.module';
import { ChattingRoomModule } from './apis/chatting-room/chatting-room.module';
import { ChatGateway } from './chat.gateway';
import { ChattingRoomInviteModule } from './apis/chatting-room-invite/chatting-room-invite.module';
import { ChattingChannelModule } from './apis/chatting-channel/chatting-channel.module';
import { ChannelHistoryModule } from './channel-history/channel-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'local' ? '.local.env' : '.server.env',
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    FriendModule,
    FriendRequestModule,
    FileModule,
    ChattingRoomModule,
    ChattingRoomInviteModule,
    ChattingChannelModule,
    ChannelHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
