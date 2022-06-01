import { Module } from '@nestjs/common';
import { ChannelHistoryService } from './channel-history.service';
import { ChannelHistoryController } from './channel-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelHistory } from './entities/channel-history.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import { User } from '../users/entities/user.entity';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelHistory, User]), ChatModule],
  controllers: [ChannelHistoryController],
  providers: [ChannelHistoryService, ChatGateway],
})
export class ChannelHistoryModule {}
