import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { GoogleModule } from './modules/google/google.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import dbConfig from './config/mySQL';
import { ConfigModule } from '@nestjs/config';
import { FacebookModule } from './modules/facebook/facebook.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(dbConfig),
        UserModule,
        GoogleModule,
        AccountModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        FacebookModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
