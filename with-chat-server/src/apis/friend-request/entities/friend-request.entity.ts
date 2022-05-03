import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @JoinColumn()
  @ManyToOne((type) => User, (user) => user.id, { eager: true })
  fromUser: User;
  @JoinColumn()
  @ManyToOne((type) => User, (user) => user.id, { eager: true })
  toUser: User;
  @Column({ type: Boolean, default: false })
  isAccepted: boolean;
}
