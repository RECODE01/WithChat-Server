import { Module } from '@nestjs/common';
import { ChannelHistoryService } from './channel-history.service';
import { ChannelHistoryController } from './channel-history.controller';

@Module({
  controllers: [ChannelHistoryController],
  providers: [ChannelHistoryService]
})
export class ChannelHistoryModule {}
