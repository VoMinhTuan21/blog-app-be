import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const initSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Blog App API')
        .setDescription('API for blog app')
        .setVersion('1.0')
        .addTag('blog')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
};

export default initSwagger;
