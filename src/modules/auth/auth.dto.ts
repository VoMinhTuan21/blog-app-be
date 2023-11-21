import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class LoginSocialDTO {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    redirectURL: string;
}

export class SignInDTO {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiPropertyOptional({
        type: 'boolean',
    })
    @IsOptional()
    @IsBoolean()
    rememberMe: boolean;
}
