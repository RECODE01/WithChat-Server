import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChattingRoomDto } from './create-chatting-room.dto';

export class UpdateChattingRoomDto {
  @ApiProperty({
    description: '채팅방 ID',
    required: true,
    example: 'c539a8c4-0f70-4d3f-8eba-2f2c716293f4',
  })
  roomId: string;
  @ApiProperty({
    description: '채팅방 이름',
    required: false,
    example: '채팅방1',
  })
  name: string;
  @ApiProperty({
    description: '채팅방 이미지',
    required: false,
    example: '이미지 url',
  })
  image: string;
}
