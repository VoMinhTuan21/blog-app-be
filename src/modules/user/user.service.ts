import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, SignUpDTO } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async create(userData: CreateUserDTO | SignUpDTO) {
        if (userData.password) {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(userData.password, salt);
            userData.password = hash;
        }

        const user = this.userRepo.create(userData);

        return await this.userRepo.save(user);
    }

    findById(id: string) {
        return this.userRepo.findOneBy({ id });
    }

    findByEmail(email: string) {
        return this.userRepo.findOneBy({ email: email });
    }
}
