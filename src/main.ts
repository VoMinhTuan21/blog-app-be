import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import initSwagger from './config/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    initSwagger(app);

    await app.listen(5500);

    console.log('⚡ Server is running on http://localhost:5500');
    console.log('⚡ Swagger is running on http://localhost:5500/api');
}
bootstrap();
