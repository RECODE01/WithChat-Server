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
import { ChattingChannelService } from './chatting-channel.service';
import { CreateChattingChannelDto } from './dto/create-chatting-channel.dto';
import { UpdateChattingChannelDto } from './dto/update-chatting-channel.dto';
import { Response } from 'express';
import { CurrentUser, ICurrentUser } from '../auth/gql-user.param';
@ApiTags('회원 채널 API')
@Controller('chatting-channel')
export class ChattingChannelController {
  constructor(
    private readonly chattingChannelService: ChattingChannelService,
  ) {}

  @Post()
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 채널 생성 API',
    description: '채팅 채널을 생성한다.',
  })
  @ApiCreatedResponse({
    description: '채팅 채널 생성 성공',
    schema: {
      example: {
        success: true,
        channel: {
          id: 'uuid',
          name: '채팅방이름',
          server: '채팅서버객체',
          createdAt: 'datetime',
          updatedAt: 'datetime',
          deletedAt: 'datetime',
        },
      },
    },
  })
  async createChattingChannel(
    @Res() res: Response,
    @Body() createChattingChannelDto: CreateChattingChannelDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.chattingChannelService
      .createChattingChannel(createChattingChannelDto, currentUser)
      .then((channel) => {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, chattingChannel: channel });
      });
  }

  @Patch()
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  // @ApiOperation({
  //   summary: '채팅 채널 생성 API',
  //   description: '채팅 채널을 생성한다.',
  // })
  // @ApiCreatedResponse({
  //   description: '채팅 채널 생성 성공',
  //   schema: {
  //     example: {
  //       success: true,
  //       channel: {
  //         id: 'uuid',
  //         name: '채팅방이름',
  //         server: '채팅서버객체',
  //         createdAt: 'datetime',
  //         updatedAt: 'datetime',
  //         deletedAt: 'datetime',
  //       },
  //     },
  //   },
  // })
  updateChattingChannel() {
    return this.chattingChannelService.updateChattingChannel();
  }

  @Delete()
  deleteChattingChannel(@Param('id') id: string) {
    return this.chattingChannelService.deleteChattingChannel(+id);
  }
}
