import User from '../../entities/user.entity';

export class CreateAccountDTO {
    socialId: string;
    type: string;
    email?: string;
    user: User;
}
