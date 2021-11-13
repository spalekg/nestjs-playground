import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({ email });

        if (user) {
            return user;
        }

        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    async create(user: CreateUserDto) {
        const newUser = this.usersRepository.create(user);

        await this.usersRepository.save(newUser);

        return newUser;
    }

    async getById(id: number) {
        const user = await this.usersRepository.findOne({ id });

        if (user) {
            return user;
        }

        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }
}
