import { ApiProperty } from '@nestjs/swagger';

export class CreateChattingChannelDto {
  @ApiProperty({
    description: '채팅 서버 ID',
    required: true,
    example: 'uuid',
  })
  serverId: string;
  @ApiProperty({
    description: '채팅 채널 이름',
    required: true,
    example: '스터디룸',
  })
  name: string;
}
