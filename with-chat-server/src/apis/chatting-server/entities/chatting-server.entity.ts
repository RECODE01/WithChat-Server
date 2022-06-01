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
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChattingServer {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '채팅 서버 ID',
    example: 'fdc6dfc1-b050-4cc3-805e-2f29f335b5ee',
  })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: '채팅 서버 이름', example: '채팅 서버1' })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({
    description: '서버 이미지',
    example: 'default.jpg',
    required: true,
  })
  image: string;

  @JoinColumn()
  @OneToMany(
    (type) => ChattingServerUserDetail,
    (chattingServerUser) => chattingServerUser.master,
    { eager: true, nullable: true },
  )
  users: ChattingServerUserDetail[];

  @JoinColumn()
  @OneToMany((type) => ChattingChannel, (channel) => channel.server, {
    eager: true,
    nullable: true,
  })
  channels: ChattingChannel[];

  @CreateDateColumn()
  @ApiProperty({ description: '채팅 서버 생성 일시' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '채팅 서버 정보 수정 일시' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity()
export class ChattingServerUserDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @JoinColumn()
  @ManyToOne((type) => ChattingServer, (master) => master.id)
  master: ChattingServer;

  @JoinColumn()
  @ManyToOne((type) => User, (user) => user.id, { eager: true })
  user: User;

  @Column({ type: 'int' })
  @ApiProperty({
    description: '서버 권한 / 0-master, 1-admin, 2-user',
    example: '0',
  })
  auth: number;
}
