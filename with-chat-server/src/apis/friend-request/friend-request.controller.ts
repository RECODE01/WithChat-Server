import {
  Controller,
  Post,
  UseGuards,
  Res,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/gql-user.param';
@ApiTags('친구 등록 API')
@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post(':targetId')
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '친구 신청 API',
    description: '대상 유저에게 친구 등록 요청',
  })
  @ApiCreatedResponse({
    description: '요청 성공',
    schema: {
      example: {
        success: true,
        message: '친구 등록 요청을 보냈습니다.',
      },
    },
  })
  createfrendReauest(
    @Res() res: Response,
    @CurrentUser() currentUser,
    @Param('targetId') targetId: string,
  ) {
    return this.friendRequestService
      .createfrendReauest(targetId, currentUser)
      .then(() => {
        res
          .status(HttpStatus.CREATED)
          .json({ success: true, message: '친구 등록 요청을 보냈습니다.' });
      });
  }

  @Post('/accept/:requestId')
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '친구 신청 수락 API',
    description: '해당 친구 신청 수락 후 친구 목록에 등록',
  })
  @ApiCreatedResponse({
    description: '요청 성공',
    schema: {
      example: {
        success: true,
        message: '친구 목록에 추가되었습니다.',
      },
    },
  })
  acceptfrendReauest(
    @Res() res: Response,
    @CurrentUser() currentUser,
    @Param('requestId') requestId: string,
  ) {
    return this.friendRequestService
      .acceptfrendReauest(requestId, currentUser)
      .then(() => {
        res
          .status(HttpStatus.CREATED)
          .json({ success: true, message: '친구 등록 요청을 보냈습니다.' });
      });
  }
}
