import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelHistoryDto {
  @ApiProperty({
    description: '채팅채널 ID',
    required: true,
    example: '1c2b4158-b01c-4349-b577-f5779ef07926',
  })
  channelId: string;

  @ApiProperty({
    description: 'message 배열',
    required: true,
    example: [
      { contents: '메세지입니다', type: 'text' },
      { contents: 'https://image.url', type: 'image' },
    ],
  })
  messages: { contents: string; type: string }[];
}
