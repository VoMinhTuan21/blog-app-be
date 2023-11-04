import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import dbConfig from './config/mySQL';

@Module({
    imports: [TypeOrmModule.forRoot(dbConfig), UserModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
