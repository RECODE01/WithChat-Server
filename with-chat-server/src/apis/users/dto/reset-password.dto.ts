import { ApiProperty } from '@nestjs/swagger';

export class ResetPwdSendMailDTO {
  @ApiProperty({
    description: '유저 email',
    required: true,
    example: 'asd@asd.asd',
  })
  email: string;

  @ApiProperty({ description: '유저 이름', required: true, example: '최건' })
  name: string;

  @ApiProperty({ description: '생년월일 - 년', example: 1996, required: true })
  year: number;

  @ApiProperty({ description: '생년월일 - 월', example: 7, required: true })
  month: number;

  @ApiProperty({ description: '생년월일 - 일', example: 31, required: true })
  day: number;
}

export class UpdatePwdDTO {
  @ApiProperty({
    description: '변경 대상 email',
    example: 'asd@asd.asd',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: '인증 토큰',
    example: '77762ef8-ffdf-4f5d-a36b-dea79fd60aac',
    required: true,
  })
  token: string;

  @ApiProperty({
    description: '변경할 비밀번호',
    example: 'PaSsWoRd',
    required: true,
  })
  newPassword: string;
}
