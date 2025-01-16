import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { QueryPostDto } from './dto/query-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return await this.postService.createPost(createPostDto, req.currentUser);
  }


  @UseGuards(AuthGuard)
  @Get()
  async getAllPost(@Query() query: QueryPostDto): Promise<{
    data: PostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    return await this.postService.getAllPost(query);
  }


  @UseGuards(AuthGuard)
  @Get(':id')
  async getOnePost(@Param('id') id: number): Promise<{
    message: string;
    data: PostEntity;
  }> {
    const singlePost = await this.postService.findOne(id);
    console.log(singlePost);
    return {
      message: "get single Successfully!",
      data: singlePost
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updatePost(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @Request() req): Promise<{ message: string, data: PostEntity }> {

    const updatePost = await this.postService.updatePost(id, updatePostDto, req.currentUser);
    return {
      message: "Post updated Successfully!",
      data: updatePost
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: number, @Request() req): Promise<{
    message: string;
    deletePost: void;
  }> {
    const deletePost = await this.postService.deletePost(id, req.currentUser);
    return {
      message: 'Post deleted successfully!',
      deletePost
    };
  }

}
