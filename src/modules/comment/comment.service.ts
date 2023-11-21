import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Comment from '../../entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentRes, CreateCommentDTO, GetCommentsQuery } from './comment.dto';
import { PostService } from '../post/post.service';
import { handleResponseFailure } from '../../util/hande-response';
import { ERROR_POST_NOT_FOUND } from '../../constances/post-response-code';
import Post from '../../entities/post.entity';
import { ERROR_COMMENT_NOT_FOUND } from '../../constances/comment-response-code';
import User from '../../entities/user.entity';
import { PaginationResponse } from '../../vendors/types/pagination';

@Injectable()
export class CommentService {
    private entityAlias: string;
    private postAlias: string;
    private userAlias: string;

    constructor(
        @InjectRepository(Comment)
        private commentRepo: Repository<Comment>,
        private readonly postService: PostService,
    ) {
        this.entityAlias = Comment.name;
        this.postAlias = Post.name;
        this.userAlias = User.name;
    }

    countByPostId(id: string) {
        const comments = this.commentRepo
            .createQueryBuilder(this.entityAlias)
            .where(`${this.entityAlias}.post_id = :id`, { id });

        return comments.getCount();
    }

    async create(commentData: CreateCommentDTO, userId: string) {
        const isExisted = await this.postService.checkExisted(
            commentData.postId,
        );

        if (!isExisted) {
            handleResponseFailure({
                error: ERROR_POST_NOT_FOUND,
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        const comment = this.commentRepo.create({
            description: commentData.description,
            post: {
                id: commentData.postId,
            },
            user: {
                id: userId,
            },
        });

        return this.commentRepo.save(comment);
    }

    async getCommentsByPost(data: GetCommentsQuery) {
        const total = await this.commentRepo.count({
            where: {
                post: {
                    id: data.postId,
                },
            },
        });

        const startIndex = data.page * data.limit;
        const endIndex = (data.page + 1) * data.limit;

        const result: PaginationResponse<CommentRes> = {
            total,
            data: [],
            rowPerpage: data.limit,
        };

        if (startIndex > 0) {
            result.previous = {
                page: data.page - 1,
                limit: data.limit,
            };
        }

        if (endIndex < total) {
            result.next = {
                page: data.page + 1,
                limit: data.limit,
            };
        }

        const query = this.commentRepo
            .createQueryBuilder(this.entityAlias)
            .leftJoinAndSelect(`${this.entityAlias}.user`, this.userAlias)
            .where(`${this.entityAlias}.post.id = :id`, { id: data.postId });

        switch (data.sortType) {
            case 1:
            default:
                query.orderBy(`${this.entityAlias}.createdAt`, 'DESC');
                break;
            case 2:
                query.orderBy(`${this.entityAlias}.love`, 'DESC');
                break;
            case 3:
                query.orderBy(`${this.entityAlias}.createdAt`, 'ASC');
                break;
        }

        query.skip(data.page * data.limit).take(data.limit);

        const comments = await query.getMany();

        result.data = comments.map((item) => ({
            id: item.id,
            description: item.description,
            createdAt: item.createdAt,
            love: item.love,
            user: {
                id: item.user.id,
                name: item.user.name,
            },
        }));

        return result;
    }

    async likeOrDisLikeComment(commentId: string, actionType: number) {
        const comment = await this.commentRepo.findOneBy({ id: commentId });

        if (!comment) {
            handleResponseFailure({
                error: ERROR_COMMENT_NOT_FOUND,
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        if (actionType === 1) {
            comment.love += 1;
        } else if (actionType === 2 && comment.love > 0) {
            comment.love -= 1;
        }

        await comment.save();

        return true;
    }
}
