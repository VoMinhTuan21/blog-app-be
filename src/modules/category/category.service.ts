import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Category from '../../entities/category.entity';
import { CategoryRes, CreateCategoryDTO } from './category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
    handleResponseFailure,
    handleResponseSuccess,
} from '../../util/hande-response';
import {
    ERROR_CREATE_CATEGORY,
    ERROR_GET_ALL_CATEGORIES,
} from '../../constances/category-response-code';
import Post from '../../entities/post.entity';

@Injectable()
export class CategoryService {
    private entityAlias: string;
    private postAlias: string;

    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ) {
        this.entityAlias = Category.name;
        this.postAlias = Post.name;
    }

    async create(data: CreateCategoryDTO) {
        try {
            const category = this.categoryRepo.create({
                title: data.title,
            });

            const newCategory = await this.categoryRepo.save(category);

            return handleResponseSuccess<CategoryRes>({
                data: {
                    id: newCategory.id,
                    title: newCategory.title,
                },
                message: 'Create category success',
            });
        } catch (error) {
            console.log('error: ', error);
            handleResponseFailure({
                error: ERROR_CREATE_CATEGORY,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async getAll() {
        try {
            const categories = await this.categoryRepo.find({
                order: {
                    createdAt: 'ASC',
                },
            });
            const result = categories.map(
                (e) =>
                    ({
                        id: e.id,
                        title: e.title,
                    } as CategoryRes),
            );

            return handleResponseSuccess<CategoryRes[]>({
                data: result,
                message: 'Get all category success',
            });
        } catch (error) {
            handleResponseFailure({
                error: ERROR_GET_ALL_CATEGORIES,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    findById(id: string) {
        return this.categoryRepo.findOneBy({ id });
    }
}
