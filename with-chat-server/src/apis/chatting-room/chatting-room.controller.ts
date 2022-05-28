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
import { ChattingRoomService } from './chatting-room.service';
import {
  ChattingRoomResult,
  MyChattingRoomList,
} from './dto/chatting-room-result.dto';
import { CreateChattingRoomDto } from './dto/create-chatting-room.dto';
import { GrantUserAuthorityDto } from './dto/grant-user-authority.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';

@Controller('chatting-room')
@ApiTags('채팅방 API')
export class ChattingRoomController {
  constructor(private readonly chattingRoomService: ChattingRoomService) {}

  @UseGuards(AuthAccessGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅방 생성 API',
    description: '채팅방을 생성한다.',
  })
  @ApiCreatedResponse({
    description: '채팅방 생성 성공',
    type: ChattingRoomResult,
  })
  createChattingRoom(
    @Res() res,
    @Body() createChattingRoomDto: CreateChattingRoomDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chattingRoomService
      .createChattingRoom(createChattingRoomDto, currentUser)
      .then((result) => {
        res.status(HttpStatus.OK).json({ success: true, result: result });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅방 목록 조회 API',
    description: '로그인한 유저가 참여중인 채팅방 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '채팅방 조회 성공',
    type: MyChattingRoomList,
  })
  fetchMyChattingRoom(@Res() res, @CurrentUser() currentUser: ICurrentUser) {
    return this.chattingRoomService
      .fetchMyChattingRoom(currentUser)
      .then((result) => {
        res.status(HttpStatus.OK).json({ success: true, result: result });
      });
  }
  @UseGuards(AuthAccessGuard)
  @Patch('')
  @ApiOperation({
    summary: '채팅방 수정 API',
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
    return this.chattingRoomService
      .updateChattingRoom(updateUserDto, currentUser)
      .then((result) => {
        if (!result) throw new ConflictException('채팅방 수정 실패');
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: '채팅방 수정 성공' });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Delete('')
  @ApiOperation({
    summary: '채팅방 삭제 API',
    description: '채팅방 삭제',
  })
  @ApiOkResponse({
    description: '삭제 성공',
    schema: { example: { success: true, message: '채팅방 삭제 성공' } },
  })
  deleteChattingRoom(
    @Res() res,
    @Query('roomId') roomId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chattingRoomService
      .deleteChattingRoom(roomId, currentUser)
      .then((result) => {
        if (!result) throw new ConflictException('채팅방 삭제 실패');
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: '채팅방 삭제 성공' });
      });
  }

  @UseGuards(AuthAccessGuard)
  @Patch('/grant')
  @ApiOperation({
    summary: '채팅방 권한 부여 API',
    description: '채팅방 권한 부여',
  })
  @ApiOkResponse({
    description: '권한 부여 성공',
    schema: { example: { success: true, message: '채팅방 권한 부여 성공' } },
  })
  grantUserAuthority(
    @Res() res,
    @Body() grantUserAuthorityDto: GrantUserAuthorityDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chattingRoomService
      .grantUserAuthority(grantUserAuthorityDto, currentUser)
      .then((result) => {
        if (!result) throw new ConflictException('권한 부여 실패');
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: '권한 부여 성공' });
      });
  }
}
