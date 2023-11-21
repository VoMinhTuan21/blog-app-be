import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ImageModule } from '../image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from '../../entities/post.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        ImageModule,
        TypeOrmModule.forFeature([Post]),
        CloudinaryModule,
        CategoryModule,
        UserModule,
    ],
    providers: [PostService],
    controllers: [PostController],
    exports: [PostService],
})
export class PostModule {}
