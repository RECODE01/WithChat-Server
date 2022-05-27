import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  HttpStatus,
  Get,
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

@Controller('chatting-room')
@ApiTags('채팅방 정보 API')
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
}
