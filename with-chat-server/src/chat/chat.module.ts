import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelHistoryService } from 'src/apis/channel-history/channel-history.service';
import { ChannelHistory } from 'src/apis/channel-history/entities/channel-history.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [ChannelHistoryService],
  providers: [ChatGateway, ChannelHistoryService],
  exports: [ChatGateway, ChannelHistoryService],
})
export class ChatModule {}
