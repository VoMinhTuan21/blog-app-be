import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsString,
    IsUUID,
} from 'class-validator';
import { ImageRes } from '../image/image.dto';
import { UserPost } from '../user/user.dto';
import { Transform } from 'class-transformer';
import { CategoryRes } from '../category/category.dto';
import { type } from 'os';

export class CreatePostDTO {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    mainDesc: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    desc: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    thumbnail: Express.Multer.File;

    @ApiProperty({ type: 'string', format: 'binary' })
    images: Express.Multer.File[];
}

export class TopStoriesQuery {
    @ApiProperty({
        type: 'string',
    })
    @IsNumber()
    @Transform((value) => parseInt(value.value))
    limit: number;
}

export class PostRes {
    id: string;
    title: string;
    mainDesc: string;
    desc: string;
    thumbnail: string;
    images: ImageRes[];
    user: UserPost;
    createdAt: Date;
    category: string;
}

export class PostItem {
    id: string;
    title: string;
    thumbnail: string;
    mainDesc: string;
    comments: number;
    category: {
        id: string;
        title: string;
    };
}

export class PostLatest {
    id: string;
    title: string;
    thumbnail?: string;
}

export class PostsLatest {
    category: CategoryRes;
    posts: PostLatest[];
}

export class PostsByCategoryQuery {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categoryId: string;

    @ApiProperty({ type: 'number' })
    @IsNotEmpty()
    @IsNumber()
    @Transform((value) => parseInt(value.value))
    limit: number;

    @ApiProperty({ type: 'number' })
    @IsNotEmpty()
    @IsNumber()
    @Transform((value) => parseInt(value.value))
    page: number;
}
