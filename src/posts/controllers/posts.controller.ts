import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {JwtAuthenticationGuard} from "src/authentication/guards/jwt-authentication.guard";
import {FindOneParams} from "src/utils/find-one.params";
import {CreatePostDto} from "../dto/create-post.dto";
import {UpdatePostDto} from "../dto/update-post.dto";
import {PostsService} from "../services/posts.service";

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Get()
    getAllPosts() {
        return this.postsService.getAllPosts();
    }

    @Get(':id')
    getPostById(@Param() { id }: FindOneParams) {
        return this.postsService.getPostById(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() post: CreatePostDto) {
        return this.postsService.createPost(post);
    }

    @Patch(':id')
    async updatePost(@Param() { id }: FindOneParams, @Body() post: UpdatePostDto) {
        return this.postsService.updatePost(Number(id), post);
    }

    @Delete('id')
    async deletePost(@Param() { id }: FindOneParams) {
        this.postsService.deletePost(Number(id));
    }
}
