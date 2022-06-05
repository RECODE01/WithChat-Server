import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ICurrentUser } from '../auth/gql-user.param';
import { FriendService } from '../friend/friend.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Token, User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { FindEmailDto } from './dto/find-email.dto';
import { ResetPwdSendMailDTO, UpdatePwdDTO } from './dto/reset-password.dto';
import { FriendRequest } from '../friend-request/entities/friend-request.entity';
import {
  ChattingServer,
  ChattingServerUserDetail,
} from '../chatting-server/entities/chatting-server.entity';
import { ChattingServerInvite } from '../chatting-server-invite/entities/chatting-server-invite.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(ChattingServer)
    private readonly chattingServerRepository: Repository<ChattingServer>,
    @InjectRepository(ChattingServerInvite)
    private readonly chattingRoomInviteRepository: Repository<ChattingServerInvite>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(ChattingServerUserDetail)
    private readonly chattingServerUserDetailRepository: Repository<ChattingServerUserDetail>,
    private readonly friendService: FriendService,
    private readonly connection: Connection,
  ) {}

  createUser = async (createUserDto: CreateUserDto) => {
    const isExist = await this.checkUserExists(createUserDto.email);
    if (isExist) {
      throw new UnprocessableEntityException('이미 존재하는 이메일 입니다.');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // const result = this.userRepository.save({ ...createUserDto });
      const salt = await bcrypt.genSalt();
      console.log(salt);

      const user = new User();
      user.email = createUserDto.email;
      user.name = createUserDto.name;
      user.password = createUserDto.password;
      user.nickName = createUserDto.nickName;
      user.year = createUserDto.year;
      user.password = await bcrypt.hash(createUserDto.password, salt);
      user.month = createUserDto.month;
      user.day = createUserDto.day;
      const result = await queryRunner.manager.save(user);

      const token = uuidv4();
      const tokenInfo = new Token();
      tokenInfo.email = createUserDto.email;
      tokenInfo.value = token;
      tokenInfo.type = 'signup';
      await queryRunner.manager.save(tokenInfo);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: process.env.MAILER_FROM,
          clientId: process.env.OAUTH_CLIENT_ID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
      });

      await transporter.sendMail({
        to: createUserDto.email,
        from: process.env.MAILER_FROM,
        subject: '이메일 인증 요청 메일입니다.',
        html: `
             <!DOCTYPE html>
             <div>
             <a>WithChat 회원가입 인증 메일입니다.</a><br/>
             <a href='https://backend.withchat.site/users/verification?email=${createUserDto.email}&token=${token}'>회원가입</a>
             </div>`,
      });

      await queryRunner.manager.save(ChattingServerUserDetail, {
        master: { id: '5a360b2a-289e-40ae-a99d-3be8830b6ba2' },
        user: { id: result.id },
        auth: 1,
      });

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };

  verification = async (email: string, token: string) => {
    const storedToken = await this.tokenRepository
      .createQueryBuilder('token')
      .where('token.email = :email', { email })
      .andWhere('token.type = :type', { type: 'signup' })
      .orderBy('token.createdAt', 'DESC')
      .getOne();

    if (!storedToken || storedToken.value !== token)
      throw new UnauthorizedException('토큰 정보가 일치하지 않습니다.');
    const result = await this.userRepository.update(
      { email: email },
      { certified: true },
    );

    return result.affected > 0;
  };

  fetchUserById = async (userId: string) => {
    return this.userRepository.findOne({
      where: { id: userId, certified: true },
    });
  };

  fetchUserByEmail = async (email: any) => {
    return this.userRepository.findOne({ where: { email, certified: true } });
  };

  loggedInUser = async (currentUser: ICurrentUser) => {
    console.log('====================1====================');
    const user = this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    console.log('====================2====================');
    const friendList = this.friendService.fetchMyFriends(currentUser);
    const friendRequestList = this.friendRequestRepository.find({
      where: {
        toUser: { id: currentUser.id, deletedAt: null },
        isAccepted: false,
      },
    });
    console.log('====================3====================');
    // const inviteList = this.chattingRoomInviteRepository.find({
    //   where: { user: { id: currentUser.id }, isAccepted: false },
    // });
    // const inviteList = this.chattingRoomInviteRepository.find({
    //   where: { user: { id: currentUser.id }, isAccepted: false },
    // });
    const inviteList = this.chattingRoomInviteRepository
      .createQueryBuilder('chattingServerInvite')
      .leftJoin('chattingServerInvite.chattingServerId', 'chattingServer')
      .where('chattingServerInvite.userId = :userId', {
        userId: currentUser.id,
      })
      .andWhere('chattingServerInvite.isAccepted = False')
      .getMany();

    console.log('====================4====================');
    const serverList = this.chattingServerRepository
      .createQueryBuilder('chattingServer')
      .leftJoin('chattingServer.users', 'chattingServerUserDetail')
      .where('chattingServerUserDetail.user = :userId', {
        userId: currentUser.id,
      })
      .getMany();
    console.log('====================5====================');

    const result = await Promise.all([
      user,
      friendList,
      friendRequestList,
      inviteList,
      serverList,
    ]).then((values) => {
      console.log(values[0]);
      console.log(values[1]);
      console.log(values[2]);
      console.log(values[3]);
      console.log(values[4]);
      return {
        user: values[0],
        friendList: values[1],
        friendRequestList: values[2],
        inviteList: values[3],
        serverList: values[4],
      };
    });
    return result;
  };

  findEmail = async (findEmailDto: FindEmailDto): Promise<string> => {
    const email = await this.userRepository
      .findOne({
        where: {
          ...findEmailDto,
        },
      })
      .then((user) => {
        return user ? user.email : '';
      });
    if (!email)
      throw new NotFoundException('일치하는 email이 존재하지 않습니다.');
    return email;
  };

  private checkUserExists = async (email: string): Promise<boolean> => {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log(user);
    return user !== null;
  };

  async sendMail(resetPwdSendMailDTO: ResetPwdSendMailDTO): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { ...resetPwdSendMailDTO },
    });
    if (!user) {
      throw new NotFoundException('일치하는 유저 정보가 없습니다.');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const token = uuidv4();
      const tokenInfo = new Token();
      tokenInfo.email = resetPwdSendMailDTO.email;
      tokenInfo.value = token;
      tokenInfo.type = 'resetPassword';
      await queryRunner.manager.save(tokenInfo);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: process.env.MAILER_FROM,
          clientId: process.env.OAUTH_CLIENT_ID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
      });

      await transporter.sendMail({
        to: resetPwdSendMailDTO.email,
        from: process.env.MAILER_FROM,
        subject: 'WithChat 비밀번호 변경 메일입니다.',
        html: `
             <!DOCTYPE html>
             <div>
             <a>WithChat 비밀번호 변경 메일입니다.</a><br/>
             <a href='${process.env.RESET_PASSWORD_PAGE_LOCAL}?email=${user.email}&token=${token}'>비밀번호 변경(localhost)</a><br/>
             <a href='${process.env.RESET_PASSWORD_PAGE}?email=${user.email}&token=${token}'>비밀번호 변경(withchat.site)</a>
             </div>`,
      });

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePassword(updatePasswordDto: UpdatePwdDTO): Promise<boolean> {
    const isValid = await this.tokenRepository
      .createQueryBuilder('token')
      .where('token.email = :email', { email: updatePasswordDto.email })
      .andWhere('token.type = :type', { type: 'resetPassword' })
      .orderBy('token.createdAt', 'DESC')
      .getOne();
    if (!isValid) throw new UnauthorizedException('권한이 없습니다.');

    const salt = await bcrypt.genSalt();

    const result = await this.userRepository.update(
      { email: updatePasswordDto.email },
      { password: await bcrypt.hash(updatePasswordDto.newPassword, salt) },
    );

    return result.affected > 0;
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    currentUser: ICurrentUser,
  ): Promise<User> {
    const result = await this.userRepository.update(
      { id: currentUser.id },
      { ...updateUserDto },
    );

    console.log(updateUserDto);
    console.log(result, 'result');
    if (result.affected < 0) throw new ConflictException('회원정보 수정 실패');

    return this.userRepository.findOne({ where: { id: currentUser.id } });
  }

  async deleteUser(currentUser: ICurrentUser): Promise<boolean> {
    const result = await this.userRepository.softDelete({ id: currentUser.id });
    return result.affected > 0;
  }

  async searchUser(keyword: string, currentUser: ICurrentUser) {
    const userList = this.userRepository
      .createQueryBuilder('users')
      .where(`users.name LIKE '%'||:keyword||'%'`, {
        keyword,
      })
      .orWhere(`users.nickName LIKE '%'||:keyword||'%'`, { keyword })
      .orWhere(`users.email LIKE '%'||:keyword||'%'`, { keyword })
      .getMany();
    const friendList = this.friendService.fetchMyFriends(currentUser);
    const friendRequestList = this.friendRequestRepository.find({
      where: { fromUser: { id: currentUser.id } },
    });
    const result = await Promise.all([
      userList,
      friendList,
      friendRequestList,
    ]).then((values) => {
      return values[0]
        .filter(
          (user) =>
            !values[1].map((friend) => friend.user.id).includes(user.id),
        )
        .map((user) => {
          return {
            ...user,
            isFriend: values[2].filter((el) => el.toUser.id === user.id).length
              ? 'w'
              : 'n',
          };
        });
    });
    console.log(result);
    return result;
  }
}
