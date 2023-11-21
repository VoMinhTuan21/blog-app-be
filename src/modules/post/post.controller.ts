import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import {
    CreatePostDTO,
    PostsByCategoryQuery,
    TopStoriesQuery,
} from './post.dto';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
    handleResponseFailure,
    handleResponseSuccess,
} from '../../util/hande-response';
import { PostService } from './post.service';
import {
    ERROR_CREATE_POST,
    ERROR_GET_LATEST_POST,
    ERROR_GET_LATEST_POSTS_ALL_CATEGORIES,
    ERROR_GET_POST,
    ERROR_GET_POSTS_BY_CATEGORY,
    ERROR_GET_RELATED_POSTS,
    ERROR_GET_TOP_STORIES,
} from '../../constances/post-response-code';

@ApiTags('Post')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreatePostDTO })
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'thumbnail', maxCount: 1 },
            { name: 'images', maxCount: 10 },
        ]),
    )
    async createPost(
        @Body() data: CreatePostDTO,
        @UploadedFiles()
        files: {
            thumbnail?: Express.Multer.File[];
            images?: Express.Multer.File[];
        },
    ) {
        (data.thumbnail = files.thumbnail[0]), (data.images = files.images);
        console.log('files.images: ', files.images);

        try {
            const post = await this.postService.create(data);
            return handleResponseSuccess({
                data: post,
                message: 'Create post success',
            });
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: ERROR_CREATE_POST,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Get()
    async getByCategory(@Query() query: PostsByCategoryQuery) {
        try {
            const data = await this.postService.getPostsByCategory(query);

            return handleResponseSuccess({
                data,
                message: 'Get posts by category success.',
            });
        } catch (error) {
            handleResponseFailure({
                error: error.response?.error || ERROR_GET_POSTS_BY_CATEGORY,
                statusCode:
                    error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Get('top-stories')
    async getTopStories(@Query() query: TopStoriesQuery) {
        try {
            const posts = await this.postService.getTopStories(query.limit);

            return handleResponseSuccess({
                data: posts,
                message: 'Get top stories success',
            });
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: ERROR_GET_TOP_STORIES,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Get('/latest-all-cate')
    async getLatestPostsAllCate(@Query() query: TopStoriesQuery) {
        try {
            const result = await this.postService.getLatestPostsAllCates(
                query.limit,
            );

            return handleResponseSuccess({
                data: result,
                message: 'Get latest posts all categories success.',
            });
        } catch (error) {
            handleResponseFailure({
                error: ERROR_GET_LATEST_POSTS_ALL_CATEGORIES,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Get('/related/:id')
    async getRelatedPost(
        @Param('id', ParseUUIDPipe) id: string,
        @Query() query: TopStoriesQuery,
    ) {
        try {
            const relatedPosts = await this.postService.getRelatedPost(
                id,
                query.limit,
            );

            return handleResponseSuccess({
                data: relatedPosts,
                message: 'Get related posts success.',
            });
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: error.response.error || ERROR_GET_RELATED_POSTS,
                statusCode: error.response.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Get('/latest/:id')
    async getLatestPosts(
        @Param('id', ParseUUIDPipe) id: string,
        @Query() query: TopStoriesQuery,
    ) {
        try {
            const relatedPosts = await this.postService.getLatestPost(
                id,
                query.limit,
            );

            return handleResponseSuccess({
                data: relatedPosts,
                message: 'Get latest posts success.',
            });
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: error.response.error || ERROR_GET_LATEST_POST,
                statusCode: error.response.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Get('/:id')
    async getById(@Param('id') id: string) {
        try {
            const post = await this.postService.getById(id);

            return handleResponseSuccess({
                message: 'Get post success',
                data: post,
            });
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: ERROR_GET_POST,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }
}
