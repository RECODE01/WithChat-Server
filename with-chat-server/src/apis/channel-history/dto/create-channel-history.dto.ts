import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelHistoryDto {
  @ApiProperty({
    description: '채팅 메세지',
    required: true,
    example: 'Hello WithChat!',
  })
  message: string;
}
