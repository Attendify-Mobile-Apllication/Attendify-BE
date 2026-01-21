import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { UserDto } from '../user/dto/user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({ description: 'User created', type: UserDto })
  @ApiConflictResponse({ description: 'Username already exists' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with current credentials' })
  @ApiOkResponse({ description: 'Password reset', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiConflictResponse({ description: 'New password must be different' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
