import { Module } from '@nestjs/common';
import { ChattingServerService } from './chatting-server.service';
import { ChattingServerController } from './chatting-server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ChattingServer,
  ChattingServerUserDetail,
} from './entities/chatting-server.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { ChattingChannel } from '../chatting-channel/entities/chatting-channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChattingServer,
      User,
      ChattingServerUserDetail,
      ChattingChannel,
    ]),
  ],
  controllers: [ChattingServerController],
  providers: [ChattingServerService, AuthModule],
})
export class ChattingRoomModule {}
