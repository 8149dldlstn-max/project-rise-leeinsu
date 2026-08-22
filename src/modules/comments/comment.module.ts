import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ICommentRepository } from './interface/comment.repository.interface';
import { ICommentService } from './interface/comment.service.interface';
import { PostModule } from '../posts/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), forwardRef(() => PostModule)],
  controllers: [CommentController],
  providers: [
    { provide: ICommentService, useClass: CommentService },
    { provide: ICommentRepository, useClass: CommentRepository },
  ],
  exports: [ICommentService],
})
export class CommentModule {}
