import { ApiProperty } from '@nestjs/swagger';

export class loginDto {
  @ApiProperty({
    description: '로그인할 유저 email',
    example: 'asd@asd.asd',
    required: true,
  })
  email: string;
  @ApiProperty({
    description: '로그인할 유저 비밀번호',
    example: 'asd123!@#',
    required: true,
  })
  password: string;
}
