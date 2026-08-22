import { Comment } from '../entity/comment.entity';

export abstract class ICommentRepository {
  abstract create(comment: Partial<Comment>): Promise<Comment>;
  abstract findById(id: number): Promise<Comment | null>;
  abstract findAllByPostId(postId: number): Promise<Comment[]>;
  abstract findAllByParentId(parentId: number): Promise<Comment[]>;
  abstract save(comment: Comment): Promise<Comment>;
  abstract remove(comment: Comment): Promise<void>;
  abstract removeAllByPostId(postId: number): Promise<void>;
}
