import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICommentRepository } from './interface/comment.repository.interface';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentRepository extends ICommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super();
  }

  create(comment: Partial<Comment>): Promise<Comment> {
    return this.commentRepository.save(this.commentRepository.create(comment));
  }

  findById(id: number): Promise<Comment | null> {
    return this.commentRepository.findOne({ where: { id } });
  }

  findAllByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { postId },
      order: { createdAt: 'ASC' },
    });
  }

  findAllByParentId(parentId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { parentId } });
  }

  save(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async remove(comment: Comment): Promise<void> {
    await this.commentRepository.remove(comment);
  }

  async removeAllByPostId(postId: number): Promise<void> {
    await this.commentRepository.delete({ postId });
  }
}
