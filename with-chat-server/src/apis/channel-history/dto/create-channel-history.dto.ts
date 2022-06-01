import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelHistoryDto {
  @ApiProperty({
    description: '채팅채널 ID',
    required: true,
    example: '1c2b4158-b01c-4349-b577-f5779ef07926',
  })
  channelId: string;

  @ApiProperty({
    description: '이',
    required: true,
    example: 'text',
  })
  type: string;

  @ApiProperty({
    description: '채팅 메세지',
    required: true,
    example: 'Hello WithChat!',
  })
  contents: string;
}
