import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelHistoryDto {
  channelId: string;

  @ApiProperty({
    description: '채팅 메세지',
    required: true,
    example: 'Hello WithChat!',
  })
  contents: string;
}
