import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class LoginResult {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;
  @ApiProperty({
    description: '로그인 유저 정보 / 친구 목록',
    example: {
      user: {
        email: 'asd@asd.asd',
        name: '최건',
        nickName: '최총',
      },
      friendList: [
        {
          email: 'asd@asd.asd',
          name: '최건',
          nickName: '최총',
        },
      ],
      friendRequest: [
        {
          id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
          fromUser: {
            email: 'asd@asd.asd',
            name: '최건',
            nickName: '최총',
          },
          toUser: {
            email: 'asd@asd.asd',
            name: '최건',
            nickName: '최총',
          },
          isAccepted: false,
        },
      ],
      inviteList: [
        {
          id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
          chattingRoom: {
            id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
            name: '채팅 서버이름',
            image: 'imageUrl',
          },
        },
      ],
      chattingRoomList: [
        {
          id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
          name: '채팅 서버이름',
          image: 'imageUrl',
        },
      ],
    },
  })
  data: {
    user: User;
    friendList: { id: string; nickname: string; email: string };
  };
}
