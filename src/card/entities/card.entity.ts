import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16 })
  cardNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  creditLimit: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.cards)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transactions: Transaction[];
}
