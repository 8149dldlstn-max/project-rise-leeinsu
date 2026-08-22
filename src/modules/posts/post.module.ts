import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostFile } from './entity/post-file.entity';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { IPostRepository } from './interface/post.repository.interface';
import { IPostService } from './interface/post.service.interface';
import { TagModule } from '../tags/tag.module';
import { CommentModule } from '../comments/comment.module';
import { TimelineMarkModule } from '../timeline-marks/timeline-mark.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostFile]),
    TagModule,
    forwardRef(() => CommentModule),
    forwardRef(() => TimelineMarkModule),
  ],
  controllers: [PostController],
  providers: [
    { provide: IPostService, useClass: PostService },
    { provide: IPostRepository, useClass: PostRepository },
  ],
  exports: [IPostService],
})
export class PostModule {}
