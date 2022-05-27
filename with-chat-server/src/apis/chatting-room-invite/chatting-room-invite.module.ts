import { Module } from '@nestjs/common';
import { ChattingRoomInviteService } from './chatting-room-invite.service';
import { ChattingRoomInviteController } from './chatting-room-invite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChattingRoom } from '../chatting-room/entities/chatting-room.entity';
import { ChattingRoomInvite } from './entities/chatting-room-invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChattingRoom, ChattingRoomInvite])],
  controllers: [ChattingRoomInviteController],
  providers: [ChattingRoomInviteService],
})
export class ChattingRoomInviteModule {}
