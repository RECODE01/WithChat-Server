import { ApiProperty } from '@nestjs/swagger';

export class CreateChattingRoomDto {
  @ApiProperty({
    description: '채팅 서버이름',
    required: true,
    example: '채팅 서버1',
  })
  name: string;

  @ApiProperty({
    description: '채팅 서버이미지',
    required: true,
    example: 'default.jpg',
    nullable: true,
  })
  image: string;
}
