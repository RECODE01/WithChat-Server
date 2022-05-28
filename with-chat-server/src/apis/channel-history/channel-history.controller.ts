import { Controller, Get, Patch, Post } from '@nestjs/common';
import { ChannelHistoryService } from './channel-history.service';

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

  // @Post()
  // createChannelgHistory() {
  //   return this.channelHistoryService.findAll();
  // }
}
