import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';
import { UsersService } from 'src/users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import {TokenPayload} from '../token-payload.interface';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    public async register(register: RegisterDto) {
        const hashedPassword = await hash(register.password, 10);

        try {
            const createdUser = await this.usersService.create({
                ...register,
                password: hashedPassword,
            });

            createdUser.password = undefined;

            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }

            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
            const user = await this.usersService.getByEmail(email);

            await this.verifyPassword(plainTextPassword, user.password);

            user.password = undefined;

            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await compare(plainTextPassword, hashedPassword);

        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);

        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieForLogout() {
        return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
    }
}
