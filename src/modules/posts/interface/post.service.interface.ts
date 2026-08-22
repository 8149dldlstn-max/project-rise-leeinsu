import { Post } from '../entity/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostResponseDto } from '../dto/post-response.dto';
import { PostListFilter } from './post.repository.interface';
import { UserRole } from '../../../common/types/user-role.enum';

export abstract class IPostService {
  abstract create(createPostDto: CreatePostDto): Promise<Post>;
  abstract findAll(filter: PostListFilter): Promise<Post[]>;
  abstract findAllByAuthor(authorId: number): Promise<Post[]>;
  abstract findById(id: number): Promise<Post>;
  abstract getOwnedPost(
    userId: number,
    postId: number,
    role: UserRole,
  ): Promise<Post>;
  abstract update(
    postId: number,
    updatePostDto: UpdatePostDto,
    role: UserRole,
  ): Promise<Post>;
  abstract remove(userId: number, postId: number, role: UserRole): Promise<void>;
  abstract toResponseDto(post: Post): PostResponseDto;
  abstract toResponseDtoList(posts: Post[]): PostResponseDto[];
}
