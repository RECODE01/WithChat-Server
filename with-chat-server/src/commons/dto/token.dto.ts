import { ApiProperty } from '@nestjs/swagger';

export class tokenDto {
  @ApiProperty({
    description: 'id',
    example: 'uuid',
  })
  id: string;
  @ApiProperty({
    description: 'id',
    example: 'asd@asd.asd',
  })
  email: string;
  @ApiProperty({
    description: 'sub',
    example: 'accessToken',
  })
  sub: string;
  @ApiProperty({
    description: '유효기간',
    example: 1516239022,
  })
  exp: number;
}
