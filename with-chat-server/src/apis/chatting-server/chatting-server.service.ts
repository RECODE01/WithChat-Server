import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { Repository, Connection } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { ChattingChannel } from '../chatting-channel/entities/chatting-channel.entity';
import { User } from '../users/entities/user.entity';
import { CreateChattingRoomDto } from './dto/create-chatting-room.dto';
import { GrantUserAuthorityDto } from './dto/grant-user-authority.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';
import {
  ChattingServer,
  ChattingServerUserDetail,
} from './entities/chatting-server.entity';

@Injectable()
export class ChattingServerService {
  constructor(
    @InjectRepository(ChattingServer)
    private readonly chattingServerRepository: Repository<ChattingServer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChattingServerUserDetail)
    private readonly chattingServerUserDetailRepository: Repository<ChattingServerUserDetail>,
    @InjectRepository(ChattingChannel)
    private readonly chattingChannelRepository: Repository<ChattingChannel>,

    private readonly connection: Connection,
  ) {}

  async createChattingServer(
    createChattingRoomDto: CreateChattingRoomDto,
    currentUser: ICurrentUser,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const server = await queryRunner.manager.save(ChattingServer, {
        ...createChattingRoomDto,
      });
      await queryRunner.manager.save(ChattingChannel, {
        name: '일반',
        server: { id: server.id },
      });
      const users = await queryRunner.manager.save(ChattingServerUserDetail, {
        master: server,
        user: { id: currentUser.id },
        auth: 0,
      });
      await queryRunner.commitTransaction();
      return { ...server, users: [users] };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async fetchMyChattingServer(currentUser: ICurrentUser) {
    const result = await this.chattingServerRepository
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
    const authority = await this.chattingServerRepository.findOne({
      where: { id: roomId },
    });
    if (
      authority.users.filter(
        (el) => el.auth === 0 && el.user.id === currentUser.id,
      ).length < 1
    )
      throw new ConflictException('권한이 없습니다.');
    return await this.chattingServerRepository.update(
      { id: roomId },
      { ...updateValue },
    );
  }

  async deleteChattingRoom(roomId: string, currentUser: ICurrentUser) {
    const authority = await this.chattingServerRepository.findOne({
      where: { id: roomId },
    });
    if (
      authority.users.filter(
        (el) => el.auth <= 1 && el.user.id === currentUser.id,
      ).length < 1
    )
      throw new ConflictException('권한이 없습니다.');
    return await this.chattingServerRepository.softDelete({ id: roomId });
  }

  async grantUserAuthority(
    grantUserAuthorityDto: GrantUserAuthorityDto,
    currentUser: ICurrentUser,
  ) {
    const authority = await this.chattingServerRepository.findOne({
      where: { id: grantUserAuthorityDto.roomId },
    });
    if (
      authority.users.filter(
        (el) => el.auth === 0 && el.user.id === currentUser.id,
      ).length < 1
    )
      throw new ConflictException('권한이 없습니다.');

    const result = await this.chattingServerUserDetailRepository.update(
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
    const result = await this.chattingServerRepository.findOne({
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
