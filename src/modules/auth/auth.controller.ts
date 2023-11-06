import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginSocialDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { handleResponseSuccess } from '../../util/hande-response';
import { IJWTInfo } from './strategies/accessToken.strategy';
import { RefreshTokenGuard } from '../../vendors/guards/refreshToken.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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
