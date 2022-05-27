import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
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
export class ChattingRoom {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '채팅방 ID',
    example: 'fdc6dfc1-b050-4cc3-805e-2f29f335b5ee',
  })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: '채팅방 이름', example: '채팅방1' })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({
    description: '채팅방 이미지',
    example: 'default.jpg',
    required: true,
  })
  image: string;

  @JoinColumn()
  @OneToMany(
    (type) => ChattingRoomUsersDetail,
    (chattingRoomUser) => chattingRoomUser.master,
    { eager: true, nullable: true },
  )
  users: ChattingRoomUsersDetail[];

  @CreateDateColumn()
  @ApiProperty({ description: '채팅방 생성 일시' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '채팅방 정보 수정 일시' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity()
export class ChattingRoomUsersDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @JoinColumn()
  @ManyToOne((type) => ChattingRoom, (master) => master.id)
  master: ChattingRoom;

  @JoinColumn()
  @ManyToOne((type) => User, (user) => user.id, { eager: true })
  user: User;

  @Column({ type: 'int' })
  @ApiProperty({
    description: '채팅방 권한 / 0-master, 1-admin, 2-user',
    example: '0',
  })
  auth: number;
}
