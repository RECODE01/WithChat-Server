import { User } from 'src/apis/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChannelHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  channelId: string;
  user: User;
  message;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
