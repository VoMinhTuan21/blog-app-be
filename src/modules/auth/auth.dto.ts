import { IsNotEmpty, IsString } from 'class-validator';

export class LoginSocialDTO {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    redirectURL: string;
}
