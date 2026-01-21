import { Role } from '../entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  password: string;

  @ApiPropertyOptional({ enum: Role, example: Role.TEACHER })
  role?: Role;
}
