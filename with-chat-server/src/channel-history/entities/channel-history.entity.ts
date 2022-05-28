import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChannelHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //   channel: string;
  //   user;
  //   contents;
  //   tpye: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
