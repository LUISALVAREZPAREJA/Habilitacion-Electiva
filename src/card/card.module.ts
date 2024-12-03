import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Card, Transaction])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
