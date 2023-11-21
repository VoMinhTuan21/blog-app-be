import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import Comment from '../../entities/comment.entity';
import { PostModule } from '../post/post.module';

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), PostModule],
    providers: [CommentService],
    exports: [CommentService],
    controllers: [CommentController],
})
export class CommentModule {}
