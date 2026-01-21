/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    return this.userService.create(signupDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.username) {
      console.log('User Found: ', user.username);
    }

    const isValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Return user without password.
    const { password: _password, ...rest } = user;
    void _password;

    const payload: { sub: string | number; username: string; role: string } = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user: rest };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findByUsername(resetPasswordDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(resetPasswordDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (resetPasswordDto.password === resetPasswordDto.newPassword) {
      throw new ConflictException('New password must be different');
    }
    return this.userService.resetPassword(resetPasswordDto.username, resetPasswordDto.newPassword);
  }
}
