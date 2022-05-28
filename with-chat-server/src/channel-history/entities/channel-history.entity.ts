import { ChattingChannel } from 'src/apis/chatting-channel/entities/chatting-channel.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChannelHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @JoinColumn()
  @OneToMany((type) => ChattingChannel, (channel) => channel.id)
  channel: ChattingChannel;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
