import { Injectable } from '@nestjs/common';
import { CreateChattingChannelDto } from './dto/create-chatting-channel.dto';
import { UpdateChattingChannelDto } from './dto/update-chatting-channel.dto';

@Injectable()
export class ChattingChannelService {
  createChattingChannel(createChattingChannelDto: CreateChattingChannelDto) {
    return 'This action adds a new chattingChannel';
  }

  updateChattingChannel() {
    return `This action returns all chattingChannel`;
  }

  deleteChattingChannel(id: number) {
    return `This action returns a #${id} chattingChannel`;
  }
}
