import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

type JwtPayload = Record<string, unknown>;
type AuthedRequest = Request & { user?: JwtPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const token = this.extractBearerToken(request?.headers?.authorization);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const jwt = this.jwtService as unknown as {
        verifyAsync<T extends JwtPayload>(token: string): Promise<T>;
      };

      const payload = await jwt.verifyAsync<JwtPayload>(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractBearerToken(header?: string): string | null {
    if (!header) {
      return null;
    }
    const [scheme, token] = header.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
      return null;
    }
    return token;
  }
}
