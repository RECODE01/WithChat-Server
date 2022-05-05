import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { FriendService } from '../friend/friend.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly friendService: FriendService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const isExist = await this.checkUserExists(createUserDto.email);
    if (isExist) {
      throw new UnprocessableEntityException('이미 존재하는 이메일 입니다.');
    }
    const result = this.userRepository.save({ ...createUserDto });
    return result;
  }

  async fetchUserById(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async fetchUserByEmail(email: any) {
    return this.userRepository.findOne({ where: { email } });
  }

  async loggedInUser(currentUser: ICurrentUser) {
    const friendList = await this.friendService.fetchMyFriends(currentUser);
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    return { user, friendList };
  }
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findEmail(
    name: string,
    year: number,
    month: number,
    day: number,
  ): Promise<string[]> {
    console.log(name, year, month, day);
    console.log('asd');
    return this.userRepository
      .find({
        where: {
          name: name,
          year,
          month,
          day,
        },
      })
      .then((users) => {
        return users.map((user) => user.email);
      });
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log(user);
    return user !== null;
  }
}
