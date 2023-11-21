import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
        nameFolder: string,
        idFileOld?: string,
    ): Promise<CloudinaryResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder: nameFolder,
                    use_filename: true,
                    unique_filename: true,
                    filename_override: file.originalname,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (idFileOld) {
                        cloudinary.uploader.destroy(idFileOld);
                    }
                    resolve(result);
                },
            );

            toStream(file.buffer).pipe(upload);
        });
    }

    async getImageUrl(publicId: string): Promise<string> {
        if (publicId) {
            const url = cloudinary.url(publicId);
            return url;
        }

        return 'https://res.cloudinary.com/cake-shop/image/upload/v1662910949/default-image_n5nxby.jpg';
    }

    deleteImage(pulbicId: string): boolean {
        try {
            cloudinary.uploader.destroy(pulbicId);
            return true;
        } catch (error) {
            return false;
        }
    }
}
