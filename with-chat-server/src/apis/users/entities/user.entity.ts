import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @ApiProperty({ description: '유저 닉네임', example: '최총' })
  nickName: string;
  @Column({ type: 'varchar', length: 80 })
  password: string;
  @CreateDateColumn()
  @ApiProperty({ description: '회원가입 일시' })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({ description: '회원정보 수정 일시' })
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
