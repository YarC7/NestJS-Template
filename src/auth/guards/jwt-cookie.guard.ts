import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtCookieGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    const request = context.switchToHttp().getRequest() as Request;
    
    // Check for JWT in cookie first, then Authorization header
    const token = request.cookies?.access_token || 
                  request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    if (err || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return user;
  }
} 