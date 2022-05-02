import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '이메일',
    required: true,
    example: 'asd@asd.com',
  })
  email: string;
  @ApiProperty({ description: '이름', required: true, example: '최건' })
  name: string;
  @ApiProperty({
    description: '비밀번호',
    required: true,
    example: 'asd123!@#',
  })
  password: string;
  @ApiProperty({ description: '닉네임', required: true, example: '최총' })
  nickName: string;
}
