import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleModule } from '../google/google.module';
import { FacebookModule } from '../facebook/facebook.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/accessToken.strategy';
import { JwtRefreshStrategy } from './strategies/refreshToken.strategy';
import { UserModule } from '../user/user.module';

@Module({
    imports: [GoogleModule, FacebookModule, JwtModule, UserModule],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
