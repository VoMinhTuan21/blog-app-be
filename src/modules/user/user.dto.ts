import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDTO {
    name: string;
    email?: string;
    password?: string;
    avatar?: string;
}

export interface UserPost extends Pick<CreateUserDTO, 'name' | 'avatar'> {
    id: string;
}

export class SignUpDTO {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
        {
            message:
                'Password must have at least one upper, lower, special character and number',
        },
    )
    password: string;
}
