import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from '../auth/gql-user.param';
import { UserResult } from './dto/user-result.dto';
import { LoginResult } from './dto/user-login.dto';

@Controller('users')
@ApiTags('회원 정보 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/byId/:userId')
  @ApiOperation({
    summary: '유저 정보 조회 API',
    description: '입력받은 유저ID와 일치하는 유저 정보를 조회한다.',
  })
  @ApiOkResponse({
    description: '조회 성공.',
    type: UserResult,
  })
  fetchUserById(@Res() res, @Param('userId') userId: string) {
    return this.usersService.fetchUserById(userId).then((result) => {
      const { password, ...user } = result;
      res.status(HttpStatus.OK).json({ success: true, user: user });
    });
  }

  @Get('/byEmail/:email')
  @ApiOperation({
    summary: '유저 정보 조회 API',
    description: '입력받은 email과 일치하는 유저 정보를 조회한다.',
  })
  @ApiOkResponse({
    description: '조회 성공.',
    type: UserResult,
  })
  fetchUserByEmail(@Res() res, @Param('email') email: string) {
    return this.usersService.fetchUserByEmail(email).then((result) => {
      const { password, ...user } = result;
      res.status(HttpStatus.OK).json({ success: true, user: user });
    });
  }

  @Post()
  @ApiOperation({ summary: '회원 가입 API', description: '유저를 생성한다.' })
  @ApiCreatedResponse({
    description: '회원가입 성공.',
    type: UserResult,
  })
  createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto).then((result) => {
      const { password, ...user } = result;
      res.status(HttpStatus.CREATED).json({ success: true, user: user });
    });
  }

  @Get('/verification?')
  verification(
    @Res() res,
    @Query('email') email: string,
    @Query('token') token: string,
  ) {
    return this.usersService.verification(email, token).then((_) => {
      res
        .status(HttpStatus.CREATED)
        .json({ success: true, message: '회원가입 완료' });
    });
  }

  @UseGuards(AuthAccessGuard)
  @Post('loggedInUser')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '로그인 유저 정보 조회 API',
    description: '로그인된 유저 정보를 조회한다.',
  })
  @ApiCreatedResponse({
    description: '조회 성공',
    type: LoginResult,
  })
  loggedInUser(@Res() res, @CurrentUser() currentUser: ICurrentUser) {
    return this.usersService
      .loggedInUser(currentUser)
      .then((result) =>
        res.status(HttpStatus.CREATED).json({ success: true, ...result }),
      );
  }

  @Get('/findEmail')
  @ApiOperation({
    summary: 'email 찾기 Api',
    description: '입력받은 회원정보와 일치하는 email 조회한다.',
  })
  @ApiOkResponse({
    description: '조회 성공',
    schema: { example: { success: true, emails: ['asd@asd.asd'] } },
  })
  findEmail(
    @Res() res,
    @Query('name') name: string,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('day') day: number,
  ) {
    return this.usersService
      .findEmail(name, year, month, day)
      .then((emails) =>
        res.status(HttpStatus.OK).json({ success: true, emails }),
      );
  }
}
