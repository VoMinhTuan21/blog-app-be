import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AccountModule } from '../account/account.module';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [AccountModule, UserModule, HttpModule],
    providers: [GoogleService],
    exports: [GoogleService],
})
export class GoogleModule {}
