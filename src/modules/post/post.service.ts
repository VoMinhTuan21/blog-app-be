import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from '../../entities/post.entity';
import { Equal, Not, Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import {
    CreatePostDTO,
    PostItem,
    PostLatest,
    PostRes,
    PostsByCategoryQuery,
    PostsLatest,
} from './post.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import Comment from '../../entities/comment.entity';
import { handleResponseFailure } from '../../util/hande-response';
import { ERROR_POST_NOT_FOUND } from '../../constances/post-response-code';
import { ERROR_CATEGORY_NOT_FOUND } from '../../constances/category-response-code';
import { PaginationResponse } from '../../vendors/types/pagination';
import { CommentRes } from '../comment/comment.dto';

@Injectable()
export class PostService {
    private entityAlias: string;
    private commentAlias: string;

    constructor(
        @InjectRepository(Post) private postRepo: Repository<Post>,
        private imageService: ImageService,
        private cloudinaryService: CloudinaryService,
        private categoryService: CategoryService,
        private userService: UserService,
    ) {
        this.entityAlias = Post.name;
        this.commentAlias = Comment.name;
    }

    async create(data: CreatePostDTO) {
        const { public_id } = await this.cloudinaryService.uploadImage(
            data.thumbnail,
            'blog-app/posts',
        );

        const category = await this.categoryService.findById(data.categoryId);

        const user = await this.userService.findById(data.userId);

        const post = this.postRepo.create({
            title: data.title,
            thumbnail: public_id,
            mainDescription: data.mainDesc,
            description: data.desc,
            category,
            user,
        });

        const newPost = await this.postRepo.save(post);

        if (data.images) {
            await this.imageService.create(data.images, newPost);
        }

        const images = await this.imageService.getImages(newPost.id);

        const result: PostRes = {
            id: newPost.id,
            title: newPost.title,
            mainDesc: newPost.mainDescription,
            desc: newPost.description,
            thumbnail: await this.cloudinaryService.getImageUrl(
                newPost.thumbnail,
            ),
            images,
            user: {
                id: user.id,
                name: user.name,
            },
            createdAt: newPost.createdAt,
            category: category.id,
        };

        return result;
    }

    async getById(id: string) {
        const post = await this.postRepo.findOne({
            where: {
                id,
            },
            relations: {
                user: true,
                category: true,
            },
        });

        const thumbnailURL = await this.cloudinaryService.getImageUrl(
            post.thumbnail,
        );

        const images = await this.imageService.getImages(id);

        return {
            id: post.id,
            createdAt: post.createdAt,
            mainDesc: post.mainDescription,
            desc: post.description,
            images,
            thumbnail: thumbnailURL,
            title: post.title,
            user: {
                id: post.user.id,
                name: post.user.name,
                avatar: post.user.avatar,
            },
            category: post.category.id,
        } as PostRes;
    }

    async getTopStories(limit: number) {
        const posts = await this.postRepo.find({
            relations: {
                category: true,
            },
            order: {
                createdAt: 'DESC',
            },
            take: limit,
        });

        return this.mapToPostItems(posts);
    }

    async getLatestPostsAllCates(limit: number) {
        const categories = (await this.categoryService.getAll()).data;

        const result: PostsLatest[] = [];

        for (const cate of categories) {
            const posts = await this.postRepo.find({
                where: {
                    category: {
                        id: cate.id,
                    },
                },
                order: {
                    createdAt: 'DESC',
                },
                take: limit,
            });

            const latestPosts: PostLatest[] = [];

            for (let index = 0; index < posts.length; index++) {
                if (index === 0) {
                    latestPosts.push({
                        id: posts[index].id,
                        title: posts[index].title,
                        thumbnail: await this.cloudinaryService.getImageUrl(
                            posts[index].thumbnail,
                        ),
                    });
                } else {
                    latestPosts.push({
                        id: posts[index].id,
                        title: posts[index].title,
                    });
                }
            }

            result.push({
                category: cate,
                posts: latestPosts,
            });
        }

        return result;
    }

    async getRelatedPost(postId: string, limit: number) {
        const post = await this.postRepo.findOne({
            relations: { category: true },
            where: { id: postId },
        });

        if (!post) {
            handleResponseFailure({
                error: ERROR_POST_NOT_FOUND,
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        const relatedPosts = await this.postRepo.find({
            where: {
                category: {
                    id: post.category.id,
                },
                id: Not(Equal(postId)),
            },
            order: {
                createdAt: 'desc',
            },
            take: limit,
        });

        const result: PostLatest[] = [];

        for (const post of relatedPosts) {
            result.push({
                id: post.id,
                title: post.title,
                thumbnail: await this.cloudinaryService.getImageUrl(
                    post.thumbnail,
                ),
            });
        }

        return result;
    }

    async getLatestPost(postId: string, limit: number) {
        const post = await this.postRepo.findOne({
            where: { id: postId },
        });

        if (!post) {
            handleResponseFailure({
                error: ERROR_POST_NOT_FOUND,
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        const latestPosts = await this.postRepo.find({
            where: {
                id: Not(Equal(postId)),
            },
            relations: {
                category: true,
            },
            order: {
                createdAt: 'desc',
            },
            take: limit,
        });

        return this.mapToPostItems(latestPosts);
    }

    async checkExisted(postId: string) {
        const post = await this.postRepo.findOneBy({ id: postId });

        return post ? true : false;
    }

    async getPostsByCategory(dataQuery: PostsByCategoryQuery) {
        const total = await this.postRepo.count({
            where: {
                category: {
                    id: dataQuery.categoryId,
                },
            },
        });

        if (total === 0) {
            handleResponseFailure({
                error: ERROR_CATEGORY_NOT_FOUND,
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        const startIndex = dataQuery.page * dataQuery.limit;
        const endIndex = (dataQuery.page + 1) * dataQuery.limit;

        const result: PaginationResponse<PostItem> = {
            total,
            data: [],
            rowPerpage: dataQuery.limit,
        };

        if (startIndex > 0) {
            result.previous = {
                page: dataQuery.page - 1,
                limit: dataQuery.limit,
            };
        }

        if (endIndex < total) {
            result.next = {
                page: dataQuery.page + 1,
                limit: dataQuery.limit,
            };
        }

        const posts = await this.postRepo.find({
            where: {
                category: {
                    id: dataQuery.categoryId,
                },
            },
            relations: {
                category: true,
            },
            order: {
                createdAt: 'DESC',
            },
            take: dataQuery.limit,
            skip: dataQuery.page * dataQuery.limit,
        });

        const data = await this.mapToPostItems(posts);

        result.data = data;

        return result;
    }

    async getNumsOfComment(postId: string) {
        const commentData = await this.postRepo
            .createQueryBuilder(this.entityAlias)
            .innerJoin(`${this.entityAlias}.comments`, this.commentAlias)
            .select(`COUNT(${this.commentAlias}.id)`, 'nums')
            .where(`${this.entityAlias}.id = :postId`, { postId: postId })
            .groupBy(`${this.entityAlias}.id`)
            .getRawOne();

        if (commentData) {
            return commentData.nums;
        }

        return 0;
    }

    async mapToPostItems(posts: Post[]) {
        const result: PostItem[] = [];

        for (const post of posts) {
            const numsOfComment = await this.getNumsOfComment(post.id);

            result.push({
                id: post.id,
                title: post.title,
                thumbnail: await this.cloudinaryService.getImageUrl(
                    post.thumbnail,
                ),
                mainDesc: post.mainDescription,
                category: {
                    id: post.category.id,
                    title: post.category.title,
                },
                comments: numsOfComment,
            });
        }

        return result;
    }
}
