import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChattingRoomDto } from './create-chatting-room.dto';

export class GrantUserAuthorityDto {
  @ApiProperty({
    description: '채팅 서버 ID',
    required: true,
    example: 'c539a8c4-0f70-4d3f-8eba-2f2c716293f4',
  })
  roomId: string;
  @ApiProperty({
    description: '권한을 부여할 유저 id',
    required: true,
    example: 'c539a8c4-0f70-4d3f-8eba-2f2c716293f4',
  })
  targetId: string;
  @ApiProperty({
    description: '권한 레벨',
    required: true,
    example: 1,
  })
  auth: number;
}
