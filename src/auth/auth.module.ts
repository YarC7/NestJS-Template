import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaService } from '../prisma.service';
import { AbilityFactory } from './casl/ability.factory';
import { CaslGuard } from './guards/casl.guard';
import { SessionService } from './session/session.service';
import { SessionController } from './session/session.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController, SessionController],
  providers: [
    AuthService, 
    JwtStrategy, 
    LocalStrategy, 
    PrismaService,
    AbilityFactory,
    CaslGuard,
    SessionService,
  ],
  exports: [AuthService, AbilityFactory, SessionService],
})
export class AuthModule {}
