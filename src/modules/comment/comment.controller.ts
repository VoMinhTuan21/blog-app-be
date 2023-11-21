import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCommentDTO, GetCommentsQuery } from './comment.dto';
import {
    handleResponseFailure,
    handleResponseSuccess,
} from '../../util/hande-response';
import {
    ERROR_CREATE_COMMENT,
    ERROR_GET_COMMENTS,
    ERROR_REACTION_COMMENTS,
} from '../../constances/comment-response-code';
import { AccessTokenGuard } from '../../vendors/guards/accessToken.guard';
import { Request } from 'express';
import { IJWTInfo } from '../auth/strategies/accessToken.strategy';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
    constructor(private readonly cmtService: CommentService) {}

    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('token')
    @Post()
    async create(@Body() cmtData: CreateCommentDTO, @Req() req: Request) {
        try {
            await this.cmtService.create(
                cmtData,
                (req.user as IJWTInfo).userId,
            );

            return handleResponseSuccess({
                data: 'success',
                message: 'Create comment success.',
            });
        } catch (error) {
            handleResponseFailure({
                error: ERROR_CREATE_COMMENT,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Get()
    async getMany(@Query() query: GetCommentsQuery) {
        try {
            const data = await this.cmtService.getCommentsByPost(query);

            return handleResponseSuccess({
                data,
                message: 'Get comments success.',
            });
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: ERROR_GET_COMMENTS,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    @Put('/like-or-dislike/:id/:type')
    async likeOrDislikeComment(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('type', ParseIntPipe) type: number,
    ) {
        try {
            const result = await this.cmtService.likeOrDisLikeComment(id, type);

            return handleResponseSuccess({
                data: result,
                message: 'Reaction to comment success.',
            });
        } catch (error) {
            handleResponseFailure({
                error: error.response?.error || ERROR_REACTION_COMMENTS,
                statusCode:
                    error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }
}
