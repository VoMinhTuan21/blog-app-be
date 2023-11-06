import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { AccountModule } from '../account/account.module';

@Module({
    imports: [HttpModule, UserModule, AccountModule],
    providers: [FacebookService],
    exports: [FacebookService],
})
export class FacebookModule {}
