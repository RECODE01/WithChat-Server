import { Module } from '@nestjs/common';
import { ChattingChannelService } from './chatting-channel.service';
import { ChattingChannelController } from './chatting-channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChattingChannel } from './entities/chatting-channel.entity';
import { ChattingServer } from '../chatting-server/entities/chatting-server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChattingChannel, ChattingServer])],
  controllers: [ChattingChannelController],
  providers: [ChattingChannelService],
})
export class ChattingChannelModule {}
