import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Image from '../../entities/image.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [TypeOrmModule.forFeature([Image]), CloudinaryModule],
    providers: [ImageService],
    exports: [ImageService],
})
export class ImageModule {}
