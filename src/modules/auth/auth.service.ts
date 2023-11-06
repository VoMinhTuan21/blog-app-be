import { Injectable } from '@nestjs/common';
import { GoogleService } from '../google/google.service';
import { handleResponseSuccess } from '../../util/hande-response';
import { LoginSocialDTO } from './auth.dto';
import { FacebookService } from '../facebook/facebook.service';
import { IJWTInfo } from './strategies/accessToken.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly googleService: GoogleService,
        private readonly facebookService: FacebookService,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async signJWTToken(userId: string): Promise<string> {
        const secret: string = this.config.get('JWT_SECRET');
        const payload: IJWTInfo = {
            userId,
        };

        const expiresIn = this.config.get('JWT_EXPIRATION');

        return this.jwtService.signAsync(payload, {
            expiresIn: expiresIn,
            secret,
        });
    }

    async signJWTRefeshToken(userId: string): Promise<string> {
        const secret: string = this.config.get('JWT_REFRESH_SECRET');
        const payload: IJWTInfo = {
            userId,
        };

        const expiresIn = this.config.get('JWT_REFRESH_EXPIRATION');

        return this.jwtService.signAsync(payload, {
            expiresIn: expiresIn,
            secret,
        });
    }

    async createAuthToken(userId: string) {
        const accessToken = await this.signJWTToken(userId);
        const refreshToken = await this.signJWTRefeshToken(userId);
        return { accessToken, refreshToken };
    }

    async loginGoogle(data: LoginSocialDTO) {
        const user = await this.googleService.preLogin(data);

        return handleResponseSuccess({
            data: await this.createAuthToken(user.id),
            message: 'Login with google success',
        });
    }

    async loginFacebook(data: LoginSocialDTO) {
        const user = await this.facebookService.preLogin(
            data.code,
            data.redirectURL,
        );
        return handleResponseSuccess({
            data: await this.createAuthToken(user.id),
            message: 'Login with facebook success',
        });
    }
}
