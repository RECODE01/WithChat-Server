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
        id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
        email: 'asd@asd.asd',
        name: '최건',
        nickName: '최총',
        createdAt: '2022-05-02T02:39:42.161Z',
        updatedAt: '2022-05-02T02:39:42.161Z',
      },
      friendList: [
        {
          id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
          nickName: '홍길동',
          email: 'asd2@asd.asd',
        },
        {
          id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
          nickName: '철수',
          email: 'asd3@asd.asd',
        },
        {
          id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
          nickName: '영희',
          email: 'asd4@asd.asd',
        },
      ],
    },
  })
  data: {
    user: User;
    friendList: { id: string; nickname: string; email: string };
  };
}
