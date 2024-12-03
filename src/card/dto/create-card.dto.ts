import { IsString, IsNumber, IsPositive, Length } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @Length(16, 16)
  cardNumber: string;

  @IsNumber()
  @IsPositive()
  creditLimit: number;
}
