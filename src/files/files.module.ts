import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PublicFile} from "./entities/public-file.entity";
import {FilesService} from "./services/files.service";

@Module({
    imports: [TypeOrmModule.forFeature([PublicFile]), ConfigModule],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {}
