import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { GoogleModule } from './modules/google/google.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import dbConfig from './config/mySQL';
import { ConfigModule } from '@nestjs/config';
import { FacebookModule } from './modules/facebook/facebook.module';
import { CategoryModule } from './modules/category/category.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { PostModule } from './modules/post/post.module';
import { ImageModule } from './modules/image/image.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(dbConfig),
        UserModule,
        GoogleModule,
        AccountModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        FacebookModule,
        CategoryModule,
        CloudinaryModule,
        PostModule,
        ImageModule,
        CommentModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
