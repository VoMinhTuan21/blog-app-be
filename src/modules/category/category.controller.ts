import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Post()
    createCategory(@Body() createData: CreateCategoryDTO) {
        return this.categoryService.create(createData);
    }

    @Get()
    getAll() {
        return this.categoryService.getAll();
    }
}
