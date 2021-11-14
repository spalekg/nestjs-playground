import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    password: string;

    @IsEmail()
    email: string;

    address: { street: string; city: string; country: string; };
}
