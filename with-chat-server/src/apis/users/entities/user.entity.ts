import { ApiProperty } from '@nestjs/swagger';
import { FriendRequest } from 'src/apis/friend-request/entities/friend-request.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '유저 ID',
    example: 'fdc6dfc1-b050-4cc3-805e-2f29f335b5ee',
  })
  id: string;
  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({ description: '유저 email', example: 'asd@asd.asd' })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  @ApiProperty({ description: '유저 이름', example: '최건' })
  name: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  @ApiProperty({
    description: '프로필 이미지',
    example: 'https://google.storage.com/api/asdasdasd',
  })
  picture: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  @ApiProperty({ description: '유저 닉네임', example: '최총' })
  nickName: string;

  @Column({ type: 'varchar', length: 80 })
  password: string;

  @ApiProperty({ description: '생년월일 - 년', example: 1996 })
  @Column({ type: 'smallint', default: 1970 })
  year: number;

  @ApiProperty({ description: '생년월일 - 월', example: 7 })
  @Column({ type: 'smallint', default: 1 })
  month: number;

  @ApiProperty({ description: '생년월일 - 일', example: 31 })
  @Column({ type: 'smallint', default: 1 })
  day: number;

  @Column({ type: 'boolean', default: false })
  certified: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: '회원가입 일시' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '회원정보 수정 일시' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn()
  @OneToMany((type) => FriendRequest, (req) => req.toUser)
  receivedFridendReq: FriendRequest[];

  @JoinColumn()
  @OneToMany((type) => FriendRequest, (req) => req.fromUser)
  sentFridendReq: FriendRequest[];
}

@Entity()
export class Token {
  // constructor({ email, value, type }) {
  //   this.email = email;
  //   this.value = value;
  //   this.type = type;
  // }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  value: string;

  @Column({ type: 'varchar', length: 30 })
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}
