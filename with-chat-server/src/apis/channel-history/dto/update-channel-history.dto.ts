import { PartialType } from '@nestjs/swagger';
import { CreateChannelHistoryDto } from './create-channel-history.dto';

export class UpdateChannelHistoryDto extends PartialType(
  CreateChannelHistoryDto,
) {}
