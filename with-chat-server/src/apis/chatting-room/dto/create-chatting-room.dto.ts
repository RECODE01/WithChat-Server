import { ApiProperty } from '@nestjs/swagger';

export class CreateChattingRoomDto {
  @ApiProperty({
    description: '채팅방이름',
    required: true,
    example: '채팅방1',
  })
  name: string;

  @ApiProperty({
    description: '채팅방이미지',
    required: true,
    example: 'default.jpg',
    nullable: true,
  })
  image: string;
}
