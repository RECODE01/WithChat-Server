import { ApiProperty } from '@nestjs/swagger';
import { ChattingServer } from 'src/apis/chatting-server/entities/chatting-server.entity';
import { ChannelHistory } from 'src/apis/channel-history/entities/channel-history.entity';
import {
  Column,
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

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @JoinColumn()
  @ManyToOne((type) => ChattingServer, (server) => server.id)
  server: ChattingServer;

  @CreateDateColumn()
  @ApiProperty({ description: '채팅 채널 생성 일시' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '채팅 채널 정보 수정 일시' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
