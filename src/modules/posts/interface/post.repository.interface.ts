import { Post } from '../entity/post.entity';
import { BoardType } from '../entity/board-type.enum';
import { PostFileType } from '../entity/post-file-type.enum';

export interface PostListFilter {
  boardType?: BoardType;
  tagId?: number;
}

export interface PostFileInput {
  type: PostFileType;
  url: string;
}

export abstract class IPostRepository {
  abstract create(post: Partial<Post>, files: PostFileInput[]): Promise<Post>;
  abstract findAll(filter: PostListFilter): Promise<Post[]>;
  abstract findAllByAuthorId(authorId: number): Promise<Post[]>;
  abstract findById(id: number): Promise<Post | null>;
  abstract save(post: Post): Promise<Post>;
  abstract remove(post: Post): Promise<void>;
  abstract replaceFilesByType(
    postId: number,
    type: PostFileType,
    urls: string[],
  ): Promise<void>;
}
