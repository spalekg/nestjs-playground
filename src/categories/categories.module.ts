import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import CategoriesController from "./controllers/categories.controller";
import {Category} from "./entities/category.entity";
import {CategoriesService} from "./services/categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
