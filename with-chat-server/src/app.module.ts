import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './apis/auth/auth.module';
import { UsersModule } from './apis/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FriendModule } from './apis/friend/friend.module';
import { FriendRequestModule } from './apis/friend-request/friend-request.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5433,
      database: 'WithChat',
      username: 'cucutoo',
      password: 'cucutoo',
      host: '34.64.111.92',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    FriendModule,
    FriendRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
