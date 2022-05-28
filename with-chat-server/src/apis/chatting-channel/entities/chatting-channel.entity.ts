import { ApiProperty } from '@nestjs/swagger';
import { ChattingRoom } from 'src/apis/chatting-room/entities/chatting-room.entity';
import { ChannelHistory } from 'src/apis/channel-history/entities/channel-history.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChattingChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @ManyToOne((type) => ChattingRoom, (room) => room.id)
  server: ChattingRoom;

  @CreateDateColumn()
  @ApiProperty({ description: '채팅 채널 생성 일시' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '채팅 채널 정보 수정 일시' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
