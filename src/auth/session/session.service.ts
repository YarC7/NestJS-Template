import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

export type Session = {
  id: string;
  userId: number;
  refreshToken: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
  isActive: boolean;
  createdAt: Date;
};

@Injectable()
export class SessionService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createSession(userId: number, userAgent?: string, ipAddress?: string): Promise<Session> {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
        userAgent,
        ipAddress,
        isActive: true,
      },
    });

    return session as Session;
  }

  async validateRefreshToken(refreshToken: string): Promise<Session | null> {
    const session = await this.prisma.session.findFirst({
      where: {
        refreshToken,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return session as Session | null;
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    const session = await this.validateRefreshToken(refreshToken);
    
    if (!session) {
      return null;
    }

    // Generate new access token
    const payload = { sub: session.userId };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  async invalidateAllUserSessions(userId: number): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  async getUserSessions(userId: number): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return sessions as Session[];
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        isActive: true,
      },
      data: { isActive: false },
    });
  }
} 