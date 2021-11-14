import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FilesModule} from "src/files/files.module";
import {UsersController} from "./controllers/users.controller";
import {User} from "./entities/user.entity";
import {UsersService} from "./services/users.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        FilesModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
