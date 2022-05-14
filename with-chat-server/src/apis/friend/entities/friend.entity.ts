import { User } from 'src/apis/users/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn()
  createdAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn()
  @OneToMany((type) => FriendDetail, (detail) => detail.master, {
    eager: true,
    nullable: true,
  })
  details: FriendDetail[];
}

@Entity()
export class FriendDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @JoinColumn()
  @ManyToOne((type) => Friend, (master) => master.id)
  master: Friend;
  @JoinColumn()
  @ManyToOne((type) => User, (user) => user.id)
  user: User;
}
