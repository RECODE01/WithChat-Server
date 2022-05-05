import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { jwtAccessStrategy } from '../auth/strategy/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { Friend, FriendDetail } from '../friend/entities/friend.entity';
import { FriendService } from '../friend/friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend, FriendDetail])],
  controllers: [UsersController],
  providers: [UsersService, jwtAccessStrategy, AuthModule, FriendService],
})
export class UsersModule {}
