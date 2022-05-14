import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, FriendDetail } from './entities/friend.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendDetail)
    private readonly friendDetailRepository: Repository<FriendDetail>,
  ) {}
  async fetchMyFriends(currentUser: ICurrentUser) {
    const friendMasterIds = await this.friendDetailRepository
      .createQueryBuilder('friendDatail')
      .leftJoinAndSelect('friendDatail.master', 'friend')
      .where('friendDatail.user = :userId', { userId: currentUser.id })
      .getMany()
      .then((result) => result.map((result) => result.master.id));

    if (friendMasterIds.length < 1) return [];

    const friendList = await this.friendDetailRepository
      .createQueryBuilder('friendDatail')
      .leftJoinAndSelect('friendDatail.user', 'user')
      .where('friendDatail.masterId IN (:...masters)', {
        masters: friendMasterIds,
      })
      .andWhere('friendDatail.userId != :currentUserId', {
        currentUserId: currentUser.id,
      })
      .getMany();

    return friendList;
  }
}
