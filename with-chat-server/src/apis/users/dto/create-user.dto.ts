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

  @ApiProperty({ description: '생년월일 - 년', example: 1996 })
  year: number;

  @ApiProperty({ description: '생년월일 - 월', example: 7 })
  month: number;

  @ApiProperty({ description: '생년월일 - 일', example: 31 })
  day: number;
}
