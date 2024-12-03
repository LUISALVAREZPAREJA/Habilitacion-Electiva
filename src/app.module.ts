import { Module } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3309,
      username: 'root',
      password: 'root',
      database: 'credit_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CardModule,
    UserModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
