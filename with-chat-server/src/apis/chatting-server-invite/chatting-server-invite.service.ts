import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { ChattingServerUserDetail } from '../chatting-server/entities/chatting-server.entity';
import { ChattingServerInvite } from './entities/chatting-server-invite.entity';

@Injectable()
export class ChattingRoomInviteService {
  constructor(
    @InjectRepository(ChattingServerInvite)
    private readonly chattingRoomInviteRepository: Repository<ChattingServerInvite>,
    private readonly connection: Connection,
  ) {}
  async createChattingRoomInvite(
    targetId: string,
    chattingServerId: string,
    currentUser: ICurrentUser,
  ) {
    const isSent = await this.chattingRoomInviteRepository.findOne({
      where: {
        chattingServer: { id: chattingServerId },
        user: { id: targetId },
      },
    });

    if (isSent) throw new ConflictException('이미 요청된 데이터가 존재합니다.');
    return await this.chattingRoomInviteRepository.save({
      chattingServer: { id: chattingServerId },
      user: { id: targetId },
    });
  }
  async acceptChattingRoomInvite(inviteId: string, currentUser: ICurrentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const request = await queryRunner.manager.findOne(ChattingServerInvite, {
        where: { id: inviteId, isAccepted: false },
      });

      if (!request)
        throw new NotFoundException('요청 정보를 찾을 수 없습니다.');

      if (request.user.id !== currentUser.id)
        throw new ForbiddenException('권한이 없습니다.');

      const updateRequest = await queryRunner.manager.update(
        ChattingServerInvite,
        { id: inviteId },
        { isAccepted: true },
      );
      if (updateRequest.affected < 1)
        throw new InternalServerErrorException(
          '서버 오류가 발생하였습니다.\r\n 다시 시도해 주세요',
        );
      const chattingRoomId = await queryRunner.manager
        .findOne(ChattingServerInvite, {
          where: { id: inviteId },
        })
        .then((invite) => invite.chattingServer.id);

      const result = await queryRunner.manager.save(ChattingServerUserDetail, {
        master: { id: chattingRoomId },
        user: { id: currentUser.id },
        auth: 2,
      });

      if (!result)
        throw new InternalServerErrorException(
          '서버 오류가 발생하였습니다.\r\n 다시 시도해 주세요',
        );
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
