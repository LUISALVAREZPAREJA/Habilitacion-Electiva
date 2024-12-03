import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // crear tarjeta
  @Post(':id/cards')
  async createCard(
    @Param('id') userId: number,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    return await this.cardService.createCard(userId, createCardDto);
  }

  // obtener saldo
  @Get(':id/saldo')
  async getCardBalance(@Param('id') id: number) {
    try {
      const balance = await this.cardService.getCardBalance(id);
      return { balance };
    } catch (error) {
      return { message: error.message };
    }
  }

  // hacer compra
  @Post(':id/comprar')
  async makePayment(@Param('id') id: number, @Body('monto') monto: number) {
    const updatedCard = await this.cardService.makePurchase(id, monto);
    return {
      message: 'Payment successful',
      card: updatedCard,
    };
  }

  //obtener tarjetas de un usuario
  @Get('user/:userId/cards')
  async getCardsByUser(@Param('userId') userId: number) {
    return this.cardService.getCardsByUser(userId);
  }

  //pagar la tarjeta
  @Post(':id/pagar')
  async payCard(@Param('id') cardId: number, @Body('monto') monto: number) {
    const updatedCard = await this.cardService.payCard(cardId, monto);

    return {
      message: 'Payment successful',
      balance: updatedCard.balance,
    };
  }

  //obtener tarjetas
  @Get('all')
  async getAllCards() {
    return this.cardService.getAllCards();
  }
}
