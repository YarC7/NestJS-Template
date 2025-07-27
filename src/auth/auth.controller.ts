import { Controller, Post, Body, UseGuards, Request, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto, 
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    const result = await this.authService.register(registerDto, userAgent, ipAddress);
    
    // Set secure cookies
    this.authService.setAuthCookies(res, result.access_token, result.refresh_token);
    
    return {
      user: result.user,
      message: 'Registration successful',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto, 
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    const result = await this.authService.login(loginDto, userAgent, ipAddress);
    
    // Set secure cookies
    this.authService.setAuthCookies(res, result.access_token, result.refresh_token);
    
    return {
      user: result.user,
      message: 'Login successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }



  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.clearAuthCookies(res);
    return { message: 'Logout successful' };
  }
}
