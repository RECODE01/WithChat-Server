import { PartialType } from '@nestjs/swagger';
import { CreateChattingRoomDto } from './create-chatting-room.dto';

export class UpdateChattingRoomDto extends PartialType(CreateChattingRoomDto) {}
