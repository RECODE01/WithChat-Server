import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { Friend, FriendDetail } from '../friend/entities/friend.entity';
import { FriendRequest } from './entities/friend-request.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    private readonly connection: Connection,
  ) {}
  async createfrendReauest(targetId: string, currentUser: ICurrentUser) {
    const isSent = await this.friendRequestRepository.findOne({
      where: {
        fromUser: { id: currentUser.id },
        toUser: { id: targetId },
        isAccepted: false,
      },
    });

    if (isSent) throw new ConflictException('이미 요청된 데이터가 존재합니다.');

    return this.friendRequestRepository.save({
      fromUser: { id: currentUser.id },
      toUser: { id: targetId },
    });
  }

  async acceptfrendReauest(requestId: string, currentUser: ICurrentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    console.log(currentUser.id);
    console.log(requestId);
    try {
      const request = await queryRunner.manager.findOne(FriendRequest, {
        where: { id: requestId, isAccepted: false },
      });

      if (!request)
        throw new NotFoundException('요청 정보를 찾을 수 없습니다.');

      if (request.fromUser.id !== currentUser.id)
        throw new ForbiddenException('권한이 없습니다.');

      const updateRequest = await queryRunner.manager.update(
        FriendRequest,
        { id: requestId },
        { isAccepted: true },
      );
      if (updateRequest.affected < 1)
        throw new InternalServerErrorException(
          '서버 오류가 발생하였습니다.\r\n 다시 시도해 주세요',
        );

      const friendMaster = await queryRunner.manager.save(Friend, {
        createdAt: new Date(),
      });

      const friendDetailFrom = await queryRunner.manager.save(FriendDetail, {
        master: { id: friendMaster.id },
        user: { id: currentUser.id },
      });
      const friendDetailto = await queryRunner.manager.save(FriendDetail, {
        master: { id: friendMaster.id },
        user: { id: request.toUser.id },
      });

      if (!friendDetailFrom || !friendDetailto)
        throw new InternalServerErrorException(
          '서버 오류가 발생하였습니다.\r\n 다시 시도해 주세요',
        );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
