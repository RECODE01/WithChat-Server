import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { Repository } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { User } from '../users/entities/user.entity';
import { CreateChattingRoomDto } from './dto/create-chatting-room.dto';
import {
  ChattingRoom,
  ChattingRoomUsersDetail,
} from './entities/chatting-room.entity';

@Injectable()
export class ChattingRoomService {
  constructor(
    @InjectRepository(ChattingRoom)
    private readonly chattingRoomRepository: Repository<ChattingRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChattingRoomUsersDetail)
    private readonly chattingRoomUsersDetailRepository: Repository<ChattingRoomUsersDetail>,
  ) {}

  async createChattingRoom(
    createChattingRoomDto: CreateChattingRoomDto,
    currentUser: ICurrentUser,
  ) {
    const master = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    const result = await this.chattingRoomRepository.save({
      ...createChattingRoomDto,
      master,
    });

    const users = this.chattingRoomUsersDetailRepository.save({
      master: result,
      user: master,
    });

    return { ...result, users: [users] };
  }
}
