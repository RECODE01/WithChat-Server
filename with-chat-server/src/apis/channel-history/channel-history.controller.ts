import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/gql-user.param';
import { ChannelHistoryService } from './channel-history.service';
import { CreateChannelHistoryDto } from './dto/create-channel-history.dto';

@Controller('channel-history')
export class ChannelHistoryController {
  constructor(private readonly channelHistoryService: ChannelHistoryService) {}

  @Get()
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 메세지 조회 api',
    description: '채팅 메세지를 보낸다',
  })
  @ApiOkResponse({
    description: '조회 성공',
    schema: {
      example: {
        success: true,
        nextIdx: 44,
        message: [
          {
            idx: 33,
            type: 'text',
            contents: '집에 가고 싶습니다.',
            createdAt: '2022-05-31T23:13:55.260Z',
            updatedAt: '2022-05-31T23:13:55.260Z',
            deletedAt: null,
            writer: {
              id: '36b60c50-cbb7-46e1-bca1-896664c98acd',
              email: 'godboy4256@naver.com',
              name: '석지웅',
              picture: null,
              nickName: '돌콩',
              createdAt: '2022-05-12T06:57:12.044Z',
              updatedAt: '2022-05-12T06:57:34.843Z',
            },
          },
          {
            idx: 34,
            type: 'text',
            contents: '집에 가고 싶습니다.',
            createdAt: '2022-05-31T23:14:04.299Z',
            updatedAt: '2022-05-31T23:14:04.299Z',
            deletedAt: null,
            writer: {
              id: '36b60c50-cbb7-46e1-bca1-896664c98acd',
              email: 'godboy4256@naver.com',
              name: '석지웅',
              picture: null,
              nickName: '돌콩',
              createdAt: '2022-05-12T06:57:12.044Z',
              updatedAt: '2022-05-12T06:57:34.843Z',
            },
          },
        ],
      },
    },
  })
  fetchChannelHistory(
    @Res() res,
    @Query('lastIdx') lastIdx: number,
    @Query('channelId') channelId: string,
    @CurrentUser() currentUser,
  ) {
    console.log(lastIdx, channelId);
    return this.channelHistoryService
      .getChannelHistory(lastIdx, channelId)
      .then((result) => {
        res.status(HttpStatus.OK).json({
          success: true,
          nextIdx: result[result.length - 1].idx,
          message: result,
        });
      });
  }
  // @Patch()
  // updateChannelgHistory() {
  //   return this.channelHistoryService.findAll();
  // }

  @Post()
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 메세지 api',
    description: '채팅 메세지를 보낸다',
  })
  createChannelgHistory(
    @Res() res,
    @Body() createChannelHistoryDto: CreateChannelHistoryDto,
    @CurrentUser() currentUser,
  ) {
    return this.channelHistoryService
      .createChannelHistory(createChannelHistoryDto, currentUser)
      .then((result) => {
        res
          .status(HttpStatus.CREATED)
          .json({ success: true, message: '채팅 전송 성공' });
      });
  }
}
