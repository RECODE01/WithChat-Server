import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser, ICurrentUser } from '../auth/gql-user.param';
import { ChattingServer } from '../chatting-server/entities/chatting-server.entity';
import { CreateChattingChannelDto } from './dto/create-chatting-channel.dto';
import { UpdateChattingChannelDto } from './dto/update-chatting-channel.dto';
import { ChattingChannel } from './entities/chatting-channel.entity';

@Injectable()
export class ChattingChannelService {
  constructor(
    @InjectRepository(ChattingChannel)
    private readonly chattingChannelRepository: Repository<ChattingChannel>,
    @InjectRepository(ChattingServer)
    private readonly chattingRoomRepository: Repository<ChattingServer>,
  ) {}
  async createChattingChannel(
    createChattingChannelDto: CreateChattingChannelDto,
    currentUser: ICurrentUser,
  ) {
    const server = await this.chattingRoomRepository.findOne({
      where: { id: createChattingChannelDto.serverId },
    });
    if (!server) throw new BadRequestException('서버 주소가 잘못되었습니다.');
    if (
      server.users.filter(
        (user) => user.auth <= 1 && user.user.id === currentUser.id,
      ).length < 1
    )
      throw new ForbiddenException('권한이 없습니다.');

    return this.chattingChannelRepository.save({
      server: { id: createChattingChannelDto.serverId },
      name: createChattingChannelDto.name,
    });
  }

  updateChattingChannel() {
    return `This action returns all chattingChannel`;
  }

  deleteChattingChannel(id: number) {
    return `This action returns a #${id} chattingChannel`;
  }
}
