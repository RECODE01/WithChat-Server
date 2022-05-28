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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { ChattingChannelService } from './chatting-channel.service';
import { CreateChattingChannelDto } from './dto/create-chatting-channel.dto';
import { UpdateChattingChannelDto } from './dto/update-chatting-channel.dto';
import { Response } from 'express';
@Controller('chatting-channel')
export class ChattingChannelController {
  constructor(
    private readonly chattingChannelService: ChattingChannelService,
  ) {}

  @Post()
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '채팅 서버 생성 API',
    description: '채팅 서버을 생성한다.',
  })
  @ApiCreatedResponse({
    description: '채팅 서버 생성 성공',
    // type: ChattingRoomResult,
  })
  createChattingChannel(
    @Res() res: Response,
    @Body() createChattingChannelDto: CreateChattingChannelDto,
  ) {
    return this.chattingChannelService.createChattingChannel(
      createChattingChannelDto,
    );
  }

  @Patch()
  updateChattingChannel() {
    return this.chattingChannelService.updateChattingChannel();
  }

  @Delete()
  deleteChattingChannel(@Param('id') id: string) {
    return this.chattingChannelService.deleteChattingChannel(+id);
  }
}
