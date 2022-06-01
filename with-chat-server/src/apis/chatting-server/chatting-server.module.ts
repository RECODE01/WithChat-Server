import { Module } from '@nestjs/common';
import { ChattingRoomService } from './chatting-server.service';
import { ChattingServerController } from './chatting-server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ChattingServer,
  ChattingServerUserDetail,
} from './entities/chatting-server.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChattingServer, User, ChattingServerUserDetail]),
  ],
  controllers: [ChattingServerController],
  providers: [ChattingRoomService, AuthModule],
})
export class ChattingRoomModule {}
