import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rawExpiresIn = configService.get<string>('JWT_EXPIRES_IN', '1d');
        const expiresIn: number | StringValue = /^\d+$/.test(rawExpiresIn) ? Number(rawExpiresIn) : (rawExpiresIn as StringValue);

        return {
          secret: configService.get<string>('JWT_SECRET', 'dev-secret'),
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
