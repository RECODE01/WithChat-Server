import {
  Controller,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/gql-user.param';
import { ChattingRoomInviteService } from './chatting-server-invite.service';
import { Response } from 'express';
@ApiTags('채팅 서버 초대 API')
@Controller('chatting-server-invite')
export class ChattingRoomInviteController {
  constructor(
    private readonly chattingRoomInviteService: ChattingRoomInviteService,
  ) {}

  @Post()
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 서버 초대 API',
    description: '대상 유저 채팅 서버 초대',
  })
  @ApiCreatedResponse({
    description: '요청 성공',
    schema: {
      example: {
        success: true,
        message: '채팅 서버 초대를 보냈습니다.',
      },
    },
  })
  createChattingRoomInvite(
    @Res() res: Response,
    @CurrentUser() currentUser,
    @Query('targetId') targetId: string,
    @Query('chattingServerId') chattingRoomId: string,
  ) {
    return this.chattingRoomInviteService
      .createChattingRoomInvite(targetId, chattingRoomId, currentUser)
      .then(() => {
        res
          .status(HttpStatus.CREATED)
          .json({ success: true, message: '채팅 서버 초대를 보냈습니다.' });
      });
  }

  @Post('/accept')
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 서버 초대 수락 API',
    description: '해당 채팅 서버 초대 수락',
  })
  @ApiCreatedResponse({
    description: '요청 성공',
    schema: {
      example: {
        success: true,
        message: '채팅 서버에 참여하였습니다.',
      },
    },
  })
  acceptChattingRoomInvite(
    @Res() res: Response,
    @CurrentUser() currentUser,
    @Query('inviteId') inviteId: string,
  ) {
    return this.chattingRoomInviteService
      .acceptChattingRoomInvite(inviteId, currentUser)
      .then(() => {
        res
          .status(HttpStatus.CREATED)
          .json({ success: true, message: '채팅 서버에 참여하였습니다.' });
      });
  }
}
