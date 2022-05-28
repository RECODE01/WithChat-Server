import { Module } from '@nestjs/common';
import { ChannelHistoryService } from './channel-history.service';
import { ChannelHistoryController } from './channel-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelHistory } from './entities/channel-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelHistory])],
  controllers: [ChannelHistoryController],
  providers: [ChannelHistoryService],
})
export class ChannelHistoryModule {}
