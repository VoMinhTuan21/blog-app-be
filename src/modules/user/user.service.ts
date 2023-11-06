import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async create(userData: CreateUserDTO) {
        const user = this.userRepo.create(userData);

        return await this.userRepo.save(user);
    }

    findById(id: string) {
        return this.userRepo.findOneBy({ id });
    }
}
