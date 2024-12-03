import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Card } from './entities/card.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  // crear tarjeta
  async createCard(
    userId: number,
    createCardDto: CreateCardDto,
  ): Promise<Card> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    const card = this.cardRepository.create({
      ...createCardDto,
      user,
    });

    await this.cardRepository.save(card);

    return card;
  }

  // obtener el saldo de una tarjeta
  async getCardBalance(cardId: number): Promise<number> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
    });

    if (!card) {
      throw new Error('Card not found');
    }

    return card.balance;
  }

  // hacer compras con una tarjeta

  async makePurchase(cardId: number, monto: number): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (monto <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    const balance =
      typeof card.balance === 'string'
        ? parseFloat(card.balance)
        : card.balance;
    const newBalance = balance + monto;
    if (newBalance > card.creditLimit) {
      throw new BadRequestException('Payment exceeds credit limit');
    }

    const transaction = this.transactionRepository.create({
      amount: monto,
      date: new Date(),
      type: 'purchase',
      card,
    });

    await this.transactionRepository.save(transaction);

    card.balance = newBalance;

    await this.cardRepository.save(card);

    return card;
  }

  //obtener tarjetas de un usuario

  async getCardsByUser(userId: number): Promise<Card[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cards'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.cards;
  }

  // hacer pago de la tarjeta
  async payCard(cardId: number, monto: number): Promise<Card> {
    if (monto <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    const card = await this.cardRepository.findOne({ where: { id: cardId } });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (monto > card.balance) {
      throw new BadRequestException('Payment exceeds available balance');
    }

    card.balance -= monto;

    const transaction = this.transactionRepository.create({
      amount: monto,
      date: new Date(),
      type: 'payment',
      card,
    });

    await this.transactionRepository.save(transaction);

    await this.cardRepository.save(card);

    return card;
  }

  // Obtener todas las tarjetas del sistema
  async getAllCards(): Promise<Card[]> {
    return await this.cardRepository.find({ relations: ['user'] });
  }
}
