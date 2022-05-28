import { Module } from '@nestjs/common';
import { ChattingChannelService } from './chatting-channel.service';
import { ChattingChannelController } from './chatting-channel.controller';

@Module({
  controllers: [ChattingChannelController],
  providers: [ChattingChannelService],
})
export class ChattingChannelModule {}
