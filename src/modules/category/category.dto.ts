import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDTO {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    title: string;
}

export class CategoryRes {
    id: string;
    title: string;
}
