import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResult {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;
  @ApiProperty({
    description: '유저 정보',
    example: {
      id: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
      email: 'asd@asd.asd',
      name: '최건',
      password: 'asd123!@#',
      createdAt: '2022-05-02T02:39:42.161Z',
      updatedAt: '2022-05-02T02:39:42.161Z',
      deletedAt: null,
    },
  })
  data: User;
}
