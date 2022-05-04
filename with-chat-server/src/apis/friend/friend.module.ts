import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, FriendDetail } from './entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, FriendDetail])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
