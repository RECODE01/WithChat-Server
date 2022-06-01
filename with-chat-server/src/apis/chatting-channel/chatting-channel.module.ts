import { Module } from '@nestjs/common';
import { ChattingChannelService } from './chatting-channel.service';
import { ChattingChannelController } from './chatting-channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChattingChannel } from './entities/chatting-channel.entity';
import { ChattingRoom } from '../chatting-room/entities/chatting-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChattingChannel, ChattingRoom])],
  controllers: [ChattingChannelController],
  providers: [ChattingChannelService],
})
export class ChattingChannelModule {}
