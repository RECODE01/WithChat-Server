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
