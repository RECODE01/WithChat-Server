import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/gql-user.param';
import { ChannelHistoryService } from './channel-history.service';
import { CreateChannelHistoryDto } from './dto/create-channel-history.dto';

@Controller('channel-history')
export class ChannelHistoryController {
  constructor(private readonly channelHistoryService: ChannelHistoryService) {}

  // @Get()
  // fetchChannelgHistory() {
  //   return this.channelHistoryService.findAll();
  // }
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
        res.status(HttpStatus.CREATED).json({ success: true, user: result });
      });
  }
}
