import { HttpStatus, Injectable } from '@nestjs/common';
import { GoogleService } from '../google/google.service';
import {
    handleResponseFailure,
    handleResponseSuccess,
} from '../../util/hande-response';
import { LoginSocialDTO, SignInDTO } from './auth.dto';
import { FacebookService } from '../facebook/facebook.service';
import { IJWTInfo } from './strategies/accessToken.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from '../user/user.dto';
import { UserService } from '../user/user.service';
import {
    ERROR_EMAIL_HAS_BEEN_USED,
    ERROR_EMAIL_NOT_FOUND,
    ERROR_PASSWORD_NOT_MATCH,
} from '../../constances/user-response-code';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly googleService: GoogleService,
        private readonly facebookService: FacebookService,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
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

    async signJWTRefeshToken(
        userId: string,
        rememberMe?: boolean,
    ): Promise<string> {
        const secret: string = this.config.get('JWT_REFRESH_SECRET');
        const payload: IJWTInfo = {
            userId,
        };

        const expiresIn = rememberMe
            ? this.config.get('JWT_REFRESH_EXPIRATION_LONG')
            : this.config.get('JWT_REFRESH_EXPIRATION_SHORT');

        return this.jwtService.signAsync(payload, {
            expiresIn: expiresIn,
            secret,
        });
    }

    async createAuthToken(userId: string, rememberMe?: boolean) {
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

    async signUp(data: SignUpDTO) {
        const user = await this.userService.findByEmail(data.email);

        if (user) {
            handleResponseFailure({
                error: ERROR_EMAIL_HAS_BEEN_USED,
                statusCode: HttpStatus.CONFLICT,
            });
        }

        const newUser = await this.userService.create(data);

        return handleResponseSuccess({
            data: await this.createAuthToken(newUser.id),
            message: 'Sign up success.',
        });
    }

    async signIn(data: SignInDTO) {
        const user = await this.userService.findByEmail(data.email);

        if (!user) {
            handleResponseFailure({
                error: ERROR_EMAIL_NOT_FOUND,
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            handleResponseFailure({
                error: ERROR_PASSWORD_NOT_MATCH,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        return this.createAuthToken(user.id, data.rememberMe);
    }
}
