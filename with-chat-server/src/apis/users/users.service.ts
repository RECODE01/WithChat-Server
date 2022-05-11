import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
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
// import { nodemailer } from 'nodemailer';
import * as nodemailer from 'nodemailer';
// const nodemailer = require('nodemailer');
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
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
      const user = new User();
      user.email = createUserDto.email;
      user.name = createUserDto.name;
      user.password = createUserDto.password;
      user.nickName = createUserDto.nickName;
      user.year = createUserDto.year;
      user.month = createUserDto.month;
      user.day = createUserDto.day;
      const result = await queryRunner.manager.save(user);

      const token = uuidv4();
      const tokenInfo = new Token();
      tokenInfo.email = createUserDto.email;
      tokenInfo.value = token;
      tokenInfo.type = 'signup';
      await queryRunner.manager.save(tokenInfo);

      console.log(createUserDto.email);
      console.log(process.env.MAILER_FROM);

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
             <a href='https://backend.withchat.site/user/verification?email=${createUserDto.email}&token=${token}'>회원가입</a>
             </div>`,
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
    const friendList = await this.friendService.fetchMyFriends(currentUser);
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    return { user, friendList };
  };
  findOne = async (id: number) => {
    return `This action returns a #${id} user`;
  };

  findEmail = async (
    name: string,
    year: number,
    month: number,
    day: number,
  ): Promise<string[]> => {
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
  };

  private checkUserExists = async (email: string): Promise<boolean> => {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log(user);
    return user !== null;
  };
}
