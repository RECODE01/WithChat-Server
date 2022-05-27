import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from '../auth/gql-user.param';
import { ChattingRoomService } from './chatting-room.service';
import { ChattingRoomResult } from './dto/chatting-room-result.dto';
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
}
