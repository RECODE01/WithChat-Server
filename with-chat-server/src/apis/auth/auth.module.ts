import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { jwtAccessStrategy } from './strategy/jwt-access.strategy';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { algorithm: 'HS256' },
      secret: 'f1BtnWgD3VKY',
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, jwtAccessStrategy],
})
export class AuthModule {}
