import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/user.entity';

export class UserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ enum: Role, example: Role.TEACHER })
  role: Role;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}
