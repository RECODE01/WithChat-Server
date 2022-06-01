import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { Repository } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { User } from '../users/entities/user.entity';
import { CreateChattingRoomDto } from './dto/create-chatting-room.dto';
import { GrantUserAuthorityDto } from './dto/grant-user-authority.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';
import {
  ChattingServer,
  ChattingServerUserDetail,
} from './entities/chatting-server.entity';

@Injectable()
export class ChattingRoomService {
  constructor(
    @InjectRepository(ChattingServer)
    private readonly chattingRoomRepository: Repository<ChattingServer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChattingServerUserDetail)
    private readonly chattingRoomUsersDetailRepository: Repository<ChattingServerUserDetail>,
  ) {}

  async createChattingRoom(
    createChattingRoomDto: CreateChattingRoomDto,
    currentUser: ICurrentUser,
  ) {
    const master = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    console.log(master);
    const result = await this.chattingRoomRepository.save({
      ...createChattingRoomDto,
    });

    const users = await this.chattingRoomUsersDetailRepository.save({
      master: result,
      user: master,
      auth: 0,
    });

    return { ...result, users: [users] };
  }

  async fetchMyChattingRoom(currentUser: ICurrentUser) {
    const result = await this.chattingRoomRepository
      .createQueryBuilder('chattingRoom')
      .leftJoin('chattingRoom.users', 'chattingRoomUserDetail')
      .where('chattingRoomUserDetail.user = :userId', {
        userId: currentUser.id,
      })
      .getMany();

    console.log(result);
    return result;
  }

  async updateChattingRoom(
    updateUserDto: UpdateChattingRoomDto,
    currentUser: ICurrentUser,
  ) {
    const { roomId, ...updateValue } = updateUserDto;
    const authority = await this.chattingRoomRepository.findOne({
      where: { id: roomId },
    });
    if (
      authority.users.filter(
        (el) => el.auth === 0 && el.user.id === currentUser.id,
      ).length < 1
    )
      throw new ConflictException('권한이 없습니다.');
    return await this.chattingRoomRepository.update(
      { id: roomId },
      { ...updateValue },
    );
  }

  async deleteChattingRoom(roomId: string, currentUser: ICurrentUser) {
    const authority = await this.chattingRoomRepository.findOne({
      where: { id: roomId },
    });
    if (
      authority.users.filter(
        (el) => el.auth <= 1 && el.user.id === currentUser.id,
      ).length < 1
    )
      throw new ConflictException('권한이 없습니다.');
    return await this.chattingRoomRepository.softDelete({ id: roomId });
  }

  async grantUserAuthority(
    grantUserAuthorityDto: GrantUserAuthorityDto,
    currentUser: ICurrentUser,
  ) {
    const authority = await this.chattingRoomRepository.findOne({
      where: { id: grantUserAuthorityDto.roomId },
    });
    if (
      authority.users.filter(
        (el) => el.auth === 0 && el.user.id === currentUser.id,
      ).length < 1
    )
      throw new ConflictException('권한이 없습니다.');

    const result = await this.chattingRoomUsersDetailRepository.update(
      {
        master: {
          id: grantUserAuthorityDto.roomId,
        },
        user: { id: grantUserAuthorityDto.targetId },
      },
      { auth: grantUserAuthorityDto.auth },
    );
    return result.affected > 0;
  }

  async fetchChattingServerDetail(currentUser: ICurrentUser, serverId: string) {
    const result = await this.chattingRoomRepository.findOne({
      where: { id: serverId },
    });
    const users = result.users.map((el) => {
      const { password, year, month, day, certified, deletedAt, ...info } =
        el.user;
      return info;
    });
    const returnVal = {
      id: result.id,
      name: result.name,
      image: result.image,
      users: users,
      channels: result.channels,
    };
    console.log(returnVal);

    return returnVal;
  }
}
