import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChattingChannelService } from './chatting-channel.service';
import { CreateChattingChannelDto } from './dto/create-chatting-channel.dto';
import { UpdateChattingChannelDto } from './dto/update-chatting-channel.dto';

@Controller('chatting-channel')
export class ChattingChannelController {
  constructor(
    private readonly chattingChannelService: ChattingChannelService,
  ) {}

  @Post()
  createChattingChannel(
    @Body() createChattingChannelDto: CreateChattingChannelDto,
  ) {
    return this.chattingChannelService.createChattingChannel(
      createChattingChannelDto,
    );
  }

  @Get()
  updateChattingChannel() {
    return this.chattingChannelService.updateChattingChannel();
  }

  @Get()
  deleteChattingChannel(@Param('id') id: string) {
    return this.chattingChannelService.deleteChattingChannel(+id);
  }
}
