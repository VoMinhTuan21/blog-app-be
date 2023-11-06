import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Account from '../../entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDTO } from './account.dto';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepo: Repository<Account>,
    ) {}

    async create(accountData: CreateAccountDTO) {
        const account = this.accountRepo.create(accountData);
        return await this.accountRepo.save(account);
    }

    async findByIdAndType(id: string, type: string) {
        const account = await this.accountRepo.findOne({
            where: {
                socialId: id,
                type,
            },
            relations: { user: true },
        });

        return account;
    }
}
