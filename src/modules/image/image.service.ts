import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Image from '../../entities/image.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import Post from '../../entities/post.entity';
import { ImageRes } from './image.dto';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image) private imageRepo: Repository<Image>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async create(files: Express.Multer.File[], post: Post) {
        for (const file of files) {
            const { public_id } = await this.cloudinaryService.uploadImage(
                file,
                'blog-app/posts',
            );

            const image = this.imageRepo.create({
                key: public_id,
                post,
            });

            await this.imageRepo.save(image);
        }
    }

    async getImages(postId: string) {
        const images = await this.imageRepo.find({
            where: {
                post: {
                    id: postId,
                },
            },
        });

        const result: ImageRes[] = [];

        for (const img of images) {
            const url = await this.cloudinaryService.getImageUrl(img.key);
            result.push({
                id: img.id,
                url,
            });
        }

        return result;
    }
}
