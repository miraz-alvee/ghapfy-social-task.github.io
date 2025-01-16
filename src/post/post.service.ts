import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository : Repository<PostEntity>
  ){}

  async createPost(createPostDto: CreatePostDto, user: UserEntity){
    const post = this.postRepository.create({ ...createPostDto, user});
    if (!post) {
      throw new UnauthorizedException('You are not authorized to create this post');
    }
    return await this.postRepository.save(post);
  }

  async getAllPost(query: QueryPostDto): Promise<{
    data: PostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const {
      keyword,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      limit = '10',
      page = '1',
    } = query;

    const qb = this.postRepository.createQueryBuilder('post');

    // Apply filtering by keyword
    if (keyword) {
      qb.where('post.title ILIKE :keyword OR post.content ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    // Apply filtering by date range
    if (startDate && endDate) {
      qb.andWhere('post.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Apply sorting
    qb.orderBy(`post.${sortBy}`, sortOrder);

    // Pagination logic
    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;
    qb.take(take).skip(skip);

    // Execute the query
    const [data, total] = await qb.getManyAndCount();

    // Return the results with pagination metadata
    return {
      data,
      total,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto, user: UserEntity): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ where: { id: postId, user } });
    if (!post) {
      throw new UnauthorizedException('You are not authorized to update this post');
    }
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);

  }

  async deletePost(postId: number, user: UserEntity): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id: postId, user } });
    if (!post) {
      throw new UnauthorizedException('You are not authorized to delete this post');
    }
    await this.postRepository.remove(post);
  }
}
