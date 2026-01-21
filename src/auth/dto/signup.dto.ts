import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../user/entities/user.entity';

export class SignupDto {
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  password: string;

  @ApiPropertyOptional({ enum: Role, example: Role.TEACHER })
  role?: Role;
}
