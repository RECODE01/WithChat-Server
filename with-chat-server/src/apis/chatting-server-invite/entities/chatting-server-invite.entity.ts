import { ChattingServer } from 'src/apis/chatting-server/entities/chatting-server.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChattingServerInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @JoinColumn()
  @ManyToOne((type) => ChattingServer, (server) => server.id, { eager: true })
  chattingServer: ChattingServer;
  @JoinColumn()
  @ManyToOne((type) => User, (user) => user.id, { eager: true })
  user: User;
  @Column({ type: Boolean, default: false })
  isAccepted: boolean;
}
