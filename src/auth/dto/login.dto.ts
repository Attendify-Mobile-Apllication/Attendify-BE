import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  password: string;
}
