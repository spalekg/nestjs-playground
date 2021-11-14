import {Controller, Delete, Post, Req, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthenticationGuard} from "src/authentication/guards/jwt-authentication.guard";
import {RequestWithUser} from "src/authentication/request-with-user.interface";
import {UsersService} from "../services/users.service";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post('avatar')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
    }

    @Delete('avatar')
    @UseGuards(JwtAuthenticationGuard)
    async deleteAvatar(@Req() request: RequestWithUser) {
        this.usersService.deleteAvatar(request.user.id);
    }
}
