import { PartialType } from '@nestjs/swagger';
import { CreateChattingChannelDto } from './create-chatting-channel.dto';

export class UpdateChattingChannelDto extends PartialType(
  CreateChattingChannelDto,
) {}
