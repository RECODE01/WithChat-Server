import { ApiProperty } from '@nestjs/swagger';
import { ChattingServer } from '../entities/chatting-server.entity';

export class ChattingRoomResult {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;
  @ApiProperty({
    description: '채팅 서버 정보',
    example: {
      id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
      name: '채팅 서버1',
      image: 'default.jpg',
      createdAt: '2022-05-02T02:39:42.161Z',
      updatedAt: '2022-05-02T02:39:42.161Z',
    },
  })
  data: ChattingServer;
}

export class MyChattingRoomList {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;
  @ApiProperty({
    description: '채팅 서버 목록',
    example: [
      {
        id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
        name: '채팅 서버1',
        image: 'default.jpg',
        createdAt: '2022-05-02T02:39:42.161Z',
        updatedAt: '2022-05-02T02:39:42.161Z',
      },
      {
        id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
        name: '채팅 서버1',
        image: 'default.jpg',
        createdAt: '2022-05-02T02:39:42.161Z',
        updatedAt: '2022-05-02T02:39:42.161Z',
      },
      {
        id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
        name: '채팅 서버1',
        image: 'default.jpg',
        createdAt: '2022-05-02T02:39:42.161Z',
        updatedAt: '2022-05-02T02:39:42.161Z',
      },
    ],
  })
  data: ChattingServer[];
}
