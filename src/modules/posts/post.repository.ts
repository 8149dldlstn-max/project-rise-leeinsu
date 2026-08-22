import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  IPostRepository,
  PostFileInput,
  PostListFilter,
} from './interface/post.repository.interface';
import { Post } from './entity/post.entity';
import { PostFile } from './entity/post-file.entity';
import { PostFileType } from './entity/post-file-type.enum';

@Injectable()
export class PostRepository extends IPostRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostFile)
    private readonly postFileRepository: Repository<PostFile>,
  ) {
    super();
  }

  create(post: Partial<Post>, files: PostFileInput[]): Promise<Post> {
    const entity = this.postRepository.create(post);
    entity.files = files.map((file) => this.postFileRepository.create(file));
    return this.postRepository.save(entity);
  }

  findAll(filter: PostListFilter): Promise<Post[]> {
    const where: FindOptionsWhere<Post> = {};
    if (filter.boardType) {
      where.boardType = filter.boardType;
    }
    if (filter.tagId) {
      where.tagId = filter.tagId;
    }
    return this.postRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['files'],
    });
  }

  findAllByAuthorId(authorId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { authorId },
      order: { createdAt: 'DESC' },
      relations: ['files'],
    });
  }

  findById(id: number): Promise<Post | null> {
    return this.postRepository.findOne({ where: { id }, relations: ['files'] });
  }

  save(post: Post): Promise<Post> {
    return this.postRepository.save(post);
  }

  async remove(post: Post): Promise<void> {
    await this.postRepository.remove(post);
  }

  async replaceFilesByType(
    postId: number,
    type: PostFileType,
    urls: string[],
  ): Promise<void> {
    await this.postFileRepository.delete({ postId, type });
    if (urls.length > 0) {
      await this.postFileRepository.save(
        urls.map((url) => this.postFileRepository.create({ postId, type, url })),
      );
    }
  }
}
