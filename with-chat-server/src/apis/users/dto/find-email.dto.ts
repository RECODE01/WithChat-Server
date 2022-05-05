import { ApiProperty } from '@nestjs/swagger';

export class FindEmailDto {
  @ApiProperty({ description: '이름', required: true, example: '최건' })
  name: string;

  @ApiProperty({ description: '생년월일 - 년', example: 1996 })
  year: number;

  @ApiProperty({ description: '생년월일 - 월', example: 7 })
  month: number;

  @ApiProperty({ description: '생년월일 - 일', example: 31 })
  day: number;
}
