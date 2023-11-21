import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { LoginSocialDTO, SignInDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import {
    handleResponseFailure,
    handleResponseSuccess,
} from '../../util/hande-response';
import { IJWTInfo } from './strategies/accessToken.strategy';
import { RefreshTokenGuard } from '../../vendors/guards/refreshToken.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignUpDTO } from '../user/user.dto';
import { ERROR_SIGN_UP } from '../../constances/user-response-code';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/google')
    loginGoogle(@Body() loginData: LoginSocialDTO) {
        return this.authService.loginGoogle(loginData);
    }

    @Post('/facebook')
    loginFacebook(@Body() loginData: LoginSocialDTO) {
        return this.authService.loginFacebook(loginData);
    }

    @Post('/sign-up')
    signUp(@Body() signUpData: SignUpDTO) {
        try {
            return this.authService.signUp(signUpData);
        } catch (error) {
            handleResponseFailure({
                error: error.response?.error || ERROR_SIGN_UP,
                statusCode:
                    error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Post('/sign-in')
    async signIn(@Body() signInData: SignInDTO) {
        try {
            return handleResponseSuccess({
                data: await this.authService.signIn(signInData),
                message: 'Sign in success.',
            });
        } catch (error) {
            handleResponseFailure({
                error: error.response?.error || ERROR_SIGN_UP,
                statusCode:
                    error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    @UseGuards(RefreshTokenGuard)
    @ApiBearerAuth('token')
    @Post('/refresh-token')
    async refreshToken(@Req() req: Request) {
        return handleResponseSuccess({
            data: await this.authService.createAuthToken(
                (req.user as IJWTInfo).userId,
            ),
            message: 'Create refresh token success',
        });
    }
}
