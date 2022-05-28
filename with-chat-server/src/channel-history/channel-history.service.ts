import { Injectable } from '@nestjs/common';
import { CreateChannelHistoryDto } from './dto/create-channel-history.dto';
import { UpdateChannelHistoryDto } from './dto/update-channel-history.dto';

@Injectable()
export class ChannelHistoryService {
  create(createChannelHistoryDto: CreateChannelHistoryDto) {
    return 'This action adds a new channelHistory';
  }

  findAll() {
    return `This action returns all channelHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channelHistory`;
  }

  update(id: number, updateChannelHistoryDto: UpdateChannelHistoryDto) {
    return `This action updates a #${id} channelHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} channelHistory`;
  }
}
