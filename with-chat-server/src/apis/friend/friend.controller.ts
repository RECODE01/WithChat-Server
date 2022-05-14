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
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, ICurrentUser } from '../auth/gql-user.param';

@Controller('friend')
@ApiTags('친구 목록 API')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  @ApiOperation({
    summary: '친구 목록 조회 API',
    description: '로그인한 유저의 친구 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '조회 성공.',
    schema: {
      example: {
        success: true,
        friendList: [
          {
            id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
            nickName: '홍길동',
            email: 'asd2@asd.asd',
          },
          {
            id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
            nickName: '철수',
            email: 'asd3@asd.asd',
          },
          {
            id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
            nickName: '영희',
            email: 'asd4@asd.asd',
          },
        ],
      },
    },
  })
  fetchMyFriends(@Res() res, @CurrentUser() currentUser: ICurrentUser) {
    return this.friendService.fetchMyFriends(currentUser).then((result) => {
      res.status(HttpStatus.OK).json({ success: true, friendList: result });
    });
  }
}
