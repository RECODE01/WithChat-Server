import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import { ChattingChannel } from 'src/apis/chatting-channel/entities/chatting-channel.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChannelHistory {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: '채팅 Index',
    example: '1',
  })
  idx: number;

  @JoinColumn()
  @ManyToOne((type) => ChattingChannel, (chattingChannel) => chattingChannel.id)
  channel: ChattingChannel;

  @JoinColumn()
  @ManyToOne((type) => User, (user) => user.id)
  writer: User;

  @Column({ type: 'varchar', length: 20, default: 'text' })
  type: string;

  @Column({ type: 'text' })
  contents: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
