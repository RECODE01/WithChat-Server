import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, User } from './entities/user.entity';
import { jwtAccessStrategy } from '../auth/strategy/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { Friend, FriendDetail } from '../friend/entities/friend.entity';
import { FriendService } from '../friend/friend.service';
// import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend, FriendDetail, Token]),
    // MailerModule.forRoot({
    //   transport: {
    //     service: 'gmail',
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       type: 'OAuth2',
    //       user: process.env.MAILER_USER,
    //       pass: process.env.MAILER_PWD,
    //       clientId: process.env.OAUTH_CLIENT_ID,
    //       clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //       refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    //     },
    //   },
    // }),
  ],
  controllers: [UsersController],
  providers: [UsersService, jwtAccessStrategy, AuthModule, FriendService],
})
export class UsersModule {}
