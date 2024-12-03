import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'missing name' })
  name: string;

  @IsEmail({}, { message: 'invalid email' })
  email: string;
}
