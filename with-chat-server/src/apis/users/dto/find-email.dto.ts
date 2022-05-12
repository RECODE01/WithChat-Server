import { ApiProperty } from '@nestjs/swagger';

export class FindEmailDto {
  @ApiProperty({ description: '유저 닉네임', required: true, example: '최총' })
  nickName: string;

  @ApiProperty({ description: '생년월일 - 년', example: 1996, required: true })
  year: number;

  @ApiProperty({ description: '생년월일 - 월', example: 7, required: true })
  month: number;

  @ApiProperty({ description: '생년월일 - 일', example: 31, required: true })
  day: number;
}
