import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  password: string;

  @ApiProperty({ example: 'N3wP@ssw0rd!' })
  newPassword: string;
}
