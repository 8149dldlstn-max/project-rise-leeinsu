import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICommentService } from './interface/comment.service.interface';
import { ICommentRepository } from './interface/comment.repository.interface';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IPostService } from '../posts/interface/post.service.interface';
import { UserRole } from '../../common/types/user-role.enum';
import { ERROR_MESSAGE } from '../../common/constants';

@Injectable()
export class CommentService extends ICommentService {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly postService: IPostService,
  ) {
    super();
  }

  async create(
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    await this.postService.findById(postId);

    if (createCommentDto.parentId) {
      const parentComment = await this.commentRepository.findById(
        createCommentDto.parentId,
      );
      if (!parentComment || parentComment.postId !== postId) {
        throw new NotFoundException(ERROR_MESSAGE.COMMENT_PARENT_NOT_FOUND);
      }
    }

    return this.commentRepository.create({
      postId,
      authorId: createCommentDto.authorId,
      parentId: createCommentDto.parentId ?? null,
      content: createCommentDto.content,
    });
  }

  async findAllByPost(postId: number): Promise<Comment[]> {
    await this.postService.findById(postId);
    return this.commentRepository.findAllByPostId(postId);
  }

  private async getOwnedComment(
    postId: number,
    commentId: number,
    userId: number,
    role: UserRole,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment || comment.postId !== postId) {
      throw new NotFoundException(ERROR_MESSAGE.COMMENT_NOT_FOUND);
    }
    if (comment.authorId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException(ERROR_MESSAGE.COMMENT_FORBIDDEN);
    }
    return comment;
  }

  async update(
    postId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    role: UserRole,
  ): Promise<Comment> {
    const comment = await this.getOwnedComment(
      postId,
      commentId,
      updateCommentDto.authorId,
      role,
    );
    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  async remove(
    postId: number,
    commentId: number,
    userId: number,
    role: UserRole,
  ): Promise<void> {
    await this.getOwnedComment(postId, commentId, userId, role);
    await this.removeWithReplies(commentId);
  }

  // 댓글 삭제 시 대댓글도 함께 삭제(CASCADE) — 게시물 삭제 원칙과 동일
  private async removeWithReplies(commentId: number): Promise<void> {
    const replies = await this.commentRepository.findAllByParentId(commentId);
    for (const reply of replies) {
      await this.removeWithReplies(reply.id);
    }
    const comment = await this.commentRepository.findById(commentId);
    if (comment) {
      await this.commentRepository.remove(comment);
    }
  }

  removeAllByPost(postId: number): Promise<void> {
    return this.commentRepository.removeAllByPostId(postId);
  }
}
