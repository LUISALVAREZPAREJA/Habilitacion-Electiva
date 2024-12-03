import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Card } from '../../card/entities/card.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Card, (card) => card.transactions)
  card: Card;

  @Column()
  type: 'purchase' | 'payment';
}
