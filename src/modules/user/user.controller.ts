import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { IJWTInfo } from '../auth/strategies/accessToken.strategy';
import {
    handleResponseFailure,
    handleResponseSuccess,
} from '../../util/hande-response';
import { ERROR_GET_USER_INFO } from '../../constances/user-response-code';
import { AccessTokenGuard } from '../../vendors/guards/accessToken.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('token')
    @Get()
    async getUserInfo(@Req() req: Request) {
        try {
            const user = await this.userService.findById(
                (req.user as IJWTInfo).userId,
            );

            return handleResponseSuccess({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                message: "Get user's info success",
            });
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: ERROR_GET_USER_INFO,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }
}
