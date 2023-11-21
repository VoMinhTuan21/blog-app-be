import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class CreateCommentDTO {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1500)
    description: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    postId: string;
}

export class GetCommentsQuery {
    @ApiProperty({ type: 'string' })
    @IsUUID()
    @IsNotEmpty()
    postId: string;

    @ApiProperty({ type: 'number' })
    @IsNotEmpty()
    @IsNumber()
    @Transform((value) => parseInt(value.value))
    page: number;

    @ApiProperty({ type: 'number' })
    @IsNumber()
    @IsNotEmpty()
    @Transform((value) => parseInt(value.value))
    limit: number;

    @ApiProperty({ type: 'number' })
    @IsIn([1, 2, 3])
    @IsNumber()
    @IsNotEmpty()
    @Transform((value) => parseInt(value.value))
    sortType: 1 | 2 | 3;
}

export interface CommentRes {
    id: string;
    description: string;
    createdAt: Date;
    love: number;
    user: {
        id: string;
        name: string;
    };
}
