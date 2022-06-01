import { Module } from '@nestjs/common';
import { ChattingRoomInviteService } from './chatting-server-invite.service';
import { ChattingRoomInviteController } from './chatting-server-invite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChattingServer } from '../chatting-server/entities/chatting-server.entity';
import { ChattingServerInvite } from './entities/chatting-server-invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChattingServer, ChattingServerInvite])],
  controllers: [ChattingRoomInviteController],
  providers: [ChattingRoomInviteService],
})
export class ChattingRoomInviteModule {}
