import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  HttpStatus,
  Get,
  Delete,
  Patch,
  ConflictException,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from '../auth/gql-user.param';
import { ChattingServerService } from './chatting-server.service';
import {
  ChattingRoomResult,
  MyChattingRoomList,
} from './dto/chatting-room-result.dto';
import { CreateChattingRoomDto } from './dto/create-chatting-room.dto';
import { GrantUserAuthorityDto } from './dto/grant-user-authority.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';

@Controller('chatting-server')
@ApiTags('채팅 서버 API')
export class ChattingServerController {
  constructor(private readonly chattingServerService: ChattingServerService) {}

  @UseGuards(AuthAccessGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 서버 생성 API',
    description: '채팅 서버을 생성한다.',
  })
  @ApiCreatedResponse({
    description: '채팅 서버 생성 성공',
    type: ChattingRoomResult,
  })
  createChattingRoom(
    @Res() res,
    @Body() createChattingRoomDto: CreateChattingRoomDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chattingServerService
      .createChattingServer(createChattingRoomDto, currentUser)
      .then((result) => {
        res.status(HttpStatus.OK).json({ success: true, result: result });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 서버 목록 조회 API',
    description: '로그인한 유저가 참여중인 채팅 서버 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '채팅 서버 조회 성공',
    type: MyChattingRoomList,
  })
  fetchMyChattingRoom(@Res() res, @CurrentUser() currentUser: ICurrentUser) {
    return this.chattingServerService
      .fetchMyChattingServer(currentUser)
      .then((result) => {
        res.status(HttpStatus.OK).json({ success: true, result: result });
      });
  }

  // @UseGuards(AuthAccessGuard)
  @Get('/:serverId')
  // @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 서버 상세 정보 조회 API',
    description: '채팅 서버 서버의 상세 정보를 조회한다.',
  })
  @ApiOkResponse({
    description: '채팅 서버 조회 성공',
    schema: {
      example: {
        success: true,
        id: '5a360b2a-289e-40ae-a99d-3be8830b6ba2',
        name: '테스트',
        image:
          'https://storage.googleapis.com/wthchat/3c31dec5-9528-4017-8613-3e44fa51431a.png',
        users: [
          {
            id: '50893644-5292-471a-a970-dbc651a592fc',
            email: 'asd@asd.asd',
            name: 'asd',
            picture: '',
            nickName: '최총123',
            createdAt: '2022-05-16T05:36:40.938Z',
            updatedAt: '2022-05-28T07:21:37.259Z',
          },
          {
            id: '1f5a82f3-5860-4fff-bcaa-a0fb310bff0d',
            email: 'kjmkjm822@naver.com',
            name: '김재민',
            picture: null,
            nickName: '~제이민',
            createdAt: '2022-05-27T21:29:06.250Z',
            updatedAt: '2022-06-01T08:42:03.067Z',
          },
          {
            id: '05f37505-9f62-4a22-9e76-ae9f9932adee',
            email: 'choigeon96@gmail.com',
            name: '최건',
            picture: null,
            nickName: '최총테스트123123',
            createdAt: '2022-06-05T06:50:20.134Z',
            updatedAt: '2022-06-05T06:50:41.384Z',
          },
        ],
        channels: [
          {
            id: '4a7f7eaa-1bd2-4628-8e59-cb7ebc7da3f3',
            name: '스터디룸',
            createdAt: '2022-06-01T07:14:41.270Z',
            updatedAt: '2022-06-01T07:14:41.270Z',
            deletedAt: null,
          },
          {
            id: 'bb28bbff-52bb-4c37-8eda-740b4704d946',
            name: '스터디룸2',
            createdAt: '2022-06-01T07:14:55.985Z',
            updatedAt: '2022-06-01T07:14:55.985Z',
            deletedAt: null,
          },
        ],
      },
    },
  })
  fetchChattingServerDetail(
    @Res() res,
    @CurrentUser() currentUser: ICurrentUser,
    @Param('serverId') serverId: string,
  ) {
    return this.chattingServerService
      .fetchChattingServerDetail(currentUser, serverId)
      .then((result) => {
        res.status(HttpStatus.OK).json({ success: true, ...result });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Patch('')
  @ApiOperation({
    summary: '채팅 서버 수정 API',
    description: '입력받은 값으로 변경',
  })
  @ApiOkResponse({
    description: '수정 성공',
  })
  updateChattingRoom(
    @Res() res,
    @Body() updateUserDto: UpdateChattingRoomDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chattingServerService
      .updateChattingRoom(updateUserDto, currentUser)
      .then((result) => {
        if (!result) throw new ConflictException('채팅 서버 수정 실패');
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: '채팅 서버 수정 성공' });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Delete('')
  @ApiOperation({
    summary: '채팅 서버 삭제 API',
    description: '채팅 서버 삭제',
  })
  @ApiOkResponse({
    description: '삭제 성공',
    schema: { example: { success: true, message: '채팅 서버 삭제 성공' } },
  })
  deleteChattingRoom(
    @Res() res,
    @Query('roomId') roomId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chattingServerService
      .deleteChattingRoom(roomId, currentUser)
      .then((result) => {
        if (!result) throw new ConflictException('채팅 서버 삭제 실패');
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: '채팅 서버 삭제 성공' });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Patch('/grant')
  @ApiOperation({
    summary: '채팅 서버 권한 부여 API',
    description: '채팅 서버 권한 부여',
  })
  @ApiOkResponse({
    description: '권한 부여 성공',
    schema: { example: { success: true, message: '채팅 서버 권한 부여 성공' } },
  })
  grantUserAuthority(
    @Res() res,
    @Body() grantUserAuthorityDto: GrantUserAuthorityDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chattingServerService
      .grantUserAuthority(grantUserAuthorityDto, currentUser)
      .then((result) => {
        if (!result) throw new ConflictException('권한 부여 실패');
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: '권한 부여 성공' });
      });
  }
}
