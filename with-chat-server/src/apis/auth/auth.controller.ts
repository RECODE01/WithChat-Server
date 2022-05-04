import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { tokenDto } from './dto/token.dto';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: '로그인 API',
    description: '입력받은 데이터와 일치하는 유저 정보로 로그인',
  })
  @ApiCreatedResponse({
    description: '회원가입 성공.',
    type: tokenDto,
  })
  login(@Res() res, @Body() loginDto: loginDto) {
    return this.authService.login(loginDto, res).then((accessToken) => {
      res.status(HttpStatus.CREATED).json({ accessToken });
    });
  }

  @Get('/checkEmail:id')
  @ApiOperation({
    summary: '메일 인증 API',
    description: 'API 호출시 회원가입 성공 처리',
  })
  @ApiCreatedResponse({
    description: '회원가입 성공.',
    type: tokenDto,
  })
  checkEmail(@Res() res, @Body() string) {
    // return this.authService.login(, res).then((accessToken) => {
    //   res.status(HttpStatus.CREATED).json({ accessToken });
    // });
  }
}
