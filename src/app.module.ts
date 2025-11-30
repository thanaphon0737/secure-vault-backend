import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'secure_vault',
      entities: [], // เราเน้น Raw SQL เลยไม่ใส่ Entity
      synchronize: false, // ไม่ให้มันไปแก้ Table ของเรา
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
