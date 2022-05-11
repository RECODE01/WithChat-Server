import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  setRefreshToken(user: User, res) {
    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email, permission: 0 },
      {
        secret: 'f1BtnWgD3VKY',
        algorithm: 'HS256',
        subject: 'accessToken',
        expiresIn: '2w',
      },
    );
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken} path=/; SameSite=None; httpOnly; secure;`,
    );
  }

  getAccessToken(user: User) {
    return this.jwtService.sign(
      { id: user.id, email: user.email, permission: 0 },
      {
        secret: 'f1BtnWgD3VKY',
        algorithm: 'HS256',
        subject: 'accessToken',
        expiresIn: '2h',
      },
    );
  }

  async login(loginDto: loginDto, res: Response) {
    console.log(loginDto);
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    console.log(user);
    if (!user)
      throw new UnauthorizedException('일치하는 계정 정보가 없습니다.');
    if (user.password !== loginDto.password)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    if (user.certified === false)
      throw new ForbiddenException('이메일 인증을 완료해 주세요.');
    await this.setRefreshToken(user, res);
    return this.getAccessToken(user);
  }
}
