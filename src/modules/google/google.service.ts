import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { UserService } from '../user/user.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IGoogleToken, IGoogleUser } from './google.response';
import { handleResponseFailure } from '../../util/hande-response';
import {
    CAN_NOT_GET_GOOGLE_TOKEN,
    CAN_NOT_GET_USER_GOOGLE,
} from '../../constances/google-response-code';
import { LoginSocialDTO } from '../auth/auth.dto';

@Injectable()
export class GoogleService {
    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly accountService: AccountService,
        private readonly userService: UserService,
    ) {}

    private async getToken(getTokenData: LoginSocialDTO) {
        try {
            const rootURl = 'https://oauth2.googleapis.com/token';

            const options = {
                code: getTokenData.code,
                client_id: this.config.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
                client_secret: this.config.get<string>(
                    'GOOGLE_OAUTH_CLIENT_SECRET',
                ),
                redirect_uri: getTokenData.redirectURL,
                grant_type: 'authorization_code',
            };

            const { data } = await this.httpService.axiosRef.post<IGoogleToken>(
                rootURl,
                options,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            return data;
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: CAN_NOT_GET_GOOGLE_TOKEN,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    private async getUserInfo(idToken: string, accessToken: string) {
        try {
            const { data } = await this.httpService.axiosRef.get<IGoogleUser>(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                },
            );

            return data;
        } catch (error) {
            handleResponseFailure({
                error: CAN_NOT_GET_USER_GOOGLE,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async preLogin(data: LoginSocialDTO) {
        const { access_token, id_token } = await this.getToken(data);

        const userInfo = await this.getUserInfo(id_token, access_token);

        const account = await this.accountService.findByIdAndType(
            userInfo.id,
            'google',
        );

        if (account) {
            return account.user;
        }

        const user = await this.userService.create({
            avatar: userInfo.picture,
            email: userInfo.email,
            name: userInfo.name,
        });

        await this.accountService.create({
            socialId: userInfo.id,
            type: 'google',
            user,
            email: userInfo.email,
        });

        return user;
    }
}
