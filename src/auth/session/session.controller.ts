import { Controller, Post, Get, Delete, UseGuards, Request, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Session } from './session.service';

@Controller('auth/sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('refresh')
  async refreshToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    
    if (!refreshToken) {
      return { message: 'No refresh token provided' };
    }

    const newAccessToken = await this.sessionService.refreshAccessToken(refreshToken);
    
    if (!newAccessToken) {
      return { message: 'Invalid refresh token' };
    }

    // Set new access token in cookie
    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return { message: 'Token refreshed successfully' };
  }

  @Get()
  async getUserSessions(@Request() req) {
    const sessions = await this.sessionService.getUserSessions(req.user.userId);
    return sessions.map((session: Session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }));
  }

  @Delete(':sessionId')
  async invalidateSession(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { sessionId } = req.params;
    
    // Check if session belongs to user
    const sessions = await this.sessionService.getUserSessions(req.user.userId);
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      return { message: 'Session not found' };
    }

    await this.sessionService.invalidateSession(sessionId);
    
    // If current session is invalidated, clear cookies
    if (session.refreshToken === req.cookies?.refresh_token) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
    }

    return { message: 'Session invalidated' };
  }

  @Delete()
  async invalidateAllSessions(@Request() req, @Res({ passthrough: true }) res: Response) {
    await this.sessionService.invalidateAllUserSessions(req.user.userId);
    
    // Clear all cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    return { message: 'All sessions invalidated' };
  }
} 