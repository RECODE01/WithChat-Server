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
  Patch,
  ConflictException,
  Delete,
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
import { UpdateUserDto } from './dto/update-user.dto';

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

  @UseGuards(AuthAccessGuard)
  @Get('/search')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '유저 정보 검색 API',
    description:
      'email, nickname에 입력 받은 keyword를 포함하는 유저 정보 목록 반환',
  })
  @ApiOkResponse({
    description: '검색 성공.',
    type: UserResult,
  })
  searchUser(
    @Res() res,
    @Query('keyword') keyword: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.usersService.searchUser(keyword, currentUser).then((result) => {
      res.status(HttpStatus.OK).json({ success: true, searchResult: result });
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

  @Get('/verification')
  @ApiOperation({ summary: 'email 인증 API', description: '서버용입니당~~' })
  createUserVerification(
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
  @Get('loggedInUser')
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
    schema: { example: { success: true, email: 'asd@asd.asd' } },
  })
  findEmail(
    @Res() res,
    @Query('nickName') nickName: string,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('day') day: number,
  ) {
    return this.usersService
      .findEmail({ nickName, year, month, day })
      .then((email) =>
        res.status(HttpStatus.OK).json({ success: true, email }),
      );
  }

  @Post('/resetPassword/sendMail')
  @ApiOperation({
    summary: '비밀번호 초기화 - 본인 인증 메일 전송 ',
    description: '비밀번호 초기화를 하기 위해 본인 인증 메일을 발송한다.',
  })
  @ApiOkResponse({
    description: '메일 전송 성공',
    schema: { example: { success: true, message: '메일이 전송되었습니다.' } },
  })
  sendMail(
    @Res() res,
    @Query('email') email: string,
    @Query('name') name: string,
  ) {
    return this.usersService
      .sendMail({ email, name })
      .then((_) =>
        res
          .status(HttpStatus.OK)
          .json({ success: true, message: '메일이 전송되었습니다.' }),
      );
  }

  @Patch('/resetPassword/updatePassword')
  @ApiOperation({
    summary: '비밀번호 변경 API',
    description: '입력받은 비밀번호로 변경',
  })
  @ApiOkResponse({
    description: '변경 성공',
    schema: { example: { success: true, message: '비밀번호 변경 성공' } },
  })
  updatePassword(
    @Res() res,
    @Query('email') email: string,
    @Query('token') token: string,
    @Query('newPassword') newPassword: string,
  ) {
    return this.usersService
      .updatePassword({ email, token, newPassword })
      .then((result) => {
        if (!result) throw new ConflictException('비밀번호 변경 실패');
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: '비밀번호 변경 성공' });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Patch('')
  @ApiOperation({
    summary: '회원정보 수정 API',
    description: '입력받은 회원정보로 변경',
  })
  @ApiOkResponse({
    description: '수정 성공',
    type: UserResult,
  })
  updateUser(
    @Res() res,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.usersService
      .updateUser(updateUserDto, currentUser)
      .then((result) => {
        if (!result) throw new ConflictException('회원정보 수정 실패');
        const { password, ...user } = result;
        return res.status(HttpStatus.OK).json({ success: true, user: user });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Delete('')
  @ApiOperation({
    summary: '회원정보 삭제 API',
    description: '로그인중인 회원 정보 삭제',
  })
  @ApiOkResponse({
    description: '삭제 성공',
    schema: { example: { success: true, message: '회원정보 삭제 성공' } },
  })
  deleteUser(@Res() res, @CurrentUser() currentUser: ICurrentUser) {
    return this.usersService.deleteUser(currentUser).then((result) => {
      if (!result) throw new ConflictException('회원정보 삭제 실패');
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: '회원정보 삭제 성공' });
    });
  }
}
