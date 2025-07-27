import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SessionService } from './session/session.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  async register(registerDto: RegisterDto, userAgent?: string, ipAddress?: string) {
    const { email, name, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Create session
    const session = await this.sessionService.createSession(user.id, userAgent, ipAddress);

    // Generate JWT token (short-lived)
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const { password: _, ...result } = user;
    return {
      user: result,
      access_token: accessToken,
      refresh_token: session.refreshToken,
    };
  }

  async login(loginDto: LoginDto, userAgent?: string, ipAddress?: string) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create session
    const session = await this.sessionService.createSession(user.id, userAgent, ipAddress);

    // Generate JWT token (short-lived)
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const { password: _, ...result } = user;
    return {
      user: result,
      access_token: accessToken,
      refresh_token: session.refreshToken,
    };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  // Helper method to set secure cookies
  setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    // Access token cookie (short-lived)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Refresh token cookie (long-lived)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  // Helper method to clear cookies
  clearAuthCookies(res: any) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
