import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelHistoryDto } from './dto/create-channel-history.dto';
import { UpdateChannelHistoryDto } from './dto/update-channel-history.dto';
import { ChannelHistory } from './entities/channel-history.entity';

@Injectable()
export class ChannelHistoryService {
  static createChannelHistory: any;
  constructor(
    @InjectRepository(ChannelHistory)
    private readonly chattingRoomRepository: Repository<ChannelHistory>,
  ) {}

  async createChannelHistory(message, channel, user) {
    const result = await this.chattingRoomRepository.save({
      channel,
      user,
      message,
    });
    return result;
  }
}
