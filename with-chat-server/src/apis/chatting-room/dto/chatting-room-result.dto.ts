import { ApiProperty } from '@nestjs/swagger';
import { ChattingRoom } from '../entities/chatting-room.entity';

export class ChattingRoomResult {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;
  @ApiProperty({
    description: '채팅방 정보',
    example: {
      id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
      name: '채팅방1',
      master: {
        id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
        email: 'asd@asd.asd',
        name: '김재현',
        nickName: 'Jaenk',
        createdAt: '2022-05-02T02:39:42.161Z',
        updatedAt: '2022-05-02T02:39:42.161Z',
      },
      image: 'default.jpg',
      createdAt: '2022-05-02T02:39:42.161Z',
      updatedAt: '2022-05-02T02:39:42.161Z',
    },
  })
  data: ChattingRoom;
}
