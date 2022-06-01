import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Connection, Repository } from 'typeorm';
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

    private readonly connection: Connection,
  ) {}

  createChannelHistory = async (
    createChannelHistoryDto: CreateChannelHistoryDto,
    currentUser: ICurrentUser,
  ) => {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: currentUser.id },
      });
      if (!user) throw new ConflictException('유저 정보가 없습니다');
      console.log(user);

      for (let i = 0; i < createChannelHistoryDto.messages.length; i++) {
        await queryRunner.manager.save(ChannelHistory, {
          writer: { id: user.id },
          channel: { id: createChannelHistoryDto.channelId },
          type: createChannelHistoryDto.messages[i].type,
          contents: createChannelHistoryDto.messages[i].contents,
        });
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };

  async getChannelHistory(lastIdx: number, channelId: string) {
    const result = await this.channelHistoryRepository
      .createQueryBuilder('channelHistory')
      .leftJoinAndSelect('channelHistory.writer', 'users')
      .where('channelHistory.channelId = :channelId', { channelId })
      .andWhere(lastIdx > -1 ? 'channelHistory.idx < :lastIdx' : '1 = 1', {
        lastIdx,
      })
      .orderBy('channelHistory.createdAt', 'ASC')
      .limit(20)
      .getMany();

    return result.map((el) => {
      const { password, year, month, day, certified, deletedAt, ...writer } =
        el.writer;
      return { ...el, writer: writer };
    });
  }
}
