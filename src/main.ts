import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import initSwagger from './config/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    initSwagger(app);

    // Process application/x-www-form-urlencoded
    app.use(
        bodyParser.urlencoded({
            extended: false,
        }),
    );

    // Process application/json
    app.use(bodyParser.json());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    await app.listen(5500);

    console.log('⚡ Server is running on http://localhost:5500');
    console.log('⚡ Swagger is running on http://localhost:5500/api');
}
bootstrap();
