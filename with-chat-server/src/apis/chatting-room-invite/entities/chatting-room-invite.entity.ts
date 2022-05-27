import { ChattingRoom } from 'src/apis/chatting-room/entities/chatting-room.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChattingRoomInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @JoinColumn()
  @ManyToOne((type) => ChattingRoom, (room) => room.id, { eager: true })
  chattingRoom: ChattingRoom;
  @JoinColumn()
  @ManyToOne((type) => User, (user) => user.id, { eager: true })
  user: User;
  @Column({ type: Boolean, default: false })
  isAccepted: boolean;
}
