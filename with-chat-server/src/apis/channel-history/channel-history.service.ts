import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket } from '@nestjs/websockets';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Repository } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { User } from '../users/entities/user.entity';
import { CreateChannelHistoryDto } from './dto/create-channel-history.dto';
import { UpdateChannelHistoryDto } from './dto/update-channel-history.dto';
import { ChannelHistory } from './entities/channel-history.entity';

@Injectable()
export class ChannelHistoryService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ChannelHistory)
    private readonly channelHistoryRepository: Repository<ChannelHistory>,

    @ConnectedSocket()
    private chatGateway: ChatGateway,
  ) {}

  createChannelHistory = async (
    createChannelHistoryDto: CreateChannelHistoryDto,
    currentUser: ICurrentUser,
  ) => {
    const user = this.userRepository.findOne({
      where: { id: '8eca01cc-e21f-42f2-b161-e133ea31b029' },
    });

    this.chatGateway.client.broadcast.emit(createChannelHistoryDto.channelId, [
      user,
      createChannelHistoryDto.contents,
    ]);
  };
}
