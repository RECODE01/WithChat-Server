import { Module } from '@nestjs/common';
import { ChattingRoomService } from './chatting-room.service';
import { ChattingRoomController } from './chatting-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChattingRoom } from './entities/chatting-room.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChattingRoom, User])],
  controllers: [ChattingRoomController],
  providers: [ChattingRoomService, AuthModule],
})
export class ChattingRoomModule {}
