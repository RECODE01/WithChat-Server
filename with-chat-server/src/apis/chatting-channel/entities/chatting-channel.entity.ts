import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChattingChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn()
  @ApiProperty({ description: '채팅 채널 생성 일시' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '채팅 채널 정보 수정 일시' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
