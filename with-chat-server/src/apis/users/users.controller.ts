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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from '../auth/gql-user.param';
import { UserResult } from './dto/user-result.dto';

@Controller('users')
@ApiTags('회원 정보 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '회원 가입 API', description: '유저를 생성한다.' })
  @ApiCreatedResponse({
    description: '회원가입 성공.',
    type: UserResult,
  })
  createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto).then((result) => {
      const { password, ...user } = result;
      res.status(HttpStatus.CREATED).json({ success: true, data: user });
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
    type: UserResult,
  })
  loggedInUser(@Res() res, @CurrentUser() currentUser: ICurrentUser) {
    return this.usersService
      .loggedInUser(currentUser)
      .then((user) =>
        res.status(HttpStatus.CREATED).json({ success: true, data: user }),
      );
  }
}
