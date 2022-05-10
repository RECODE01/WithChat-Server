import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './apis/auth/auth.module';
import { UsersModule } from './apis/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendModule } from './apis/friend/friend.module';
import { FriendRequestModule } from './apis/friend-request/friend-request.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'local' ? '.local.env' : '.server.env',
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    FriendModule,
    FriendRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
