import { Comment } from '../entity/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { UserRole } from '../../../common/types/user-role.enum';

export abstract class ICommentService {
  abstract create(
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment>;
  abstract findAllByPost(postId: number): Promise<Comment[]>;
  abstract update(
    postId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    role: UserRole,
  ): Promise<Comment>;
  abstract remove(
    postId: number,
    commentId: number,
    userId: number,
    role: UserRole,
  ): Promise<void>;
  abstract removeAllByPost(postId: number): Promise<void>;
}
