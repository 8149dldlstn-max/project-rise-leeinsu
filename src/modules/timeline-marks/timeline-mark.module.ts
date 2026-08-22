import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineMark } from './entity/timeline-mark.entity';
import { TimelineMarkRepository } from './timeline-mark.repository';
import { TimelineMarkService } from './timeline-mark.service';
import { TimelineMarkController } from './timeline-mark.controller';
import { ITimelineMarkRepository } from './interface/timeline-mark.repository.interface';
import { ITimelineMarkService } from './interface/timeline-mark.service.interface';
import { PostModule } from '../posts/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimelineMark]),
    forwardRef(() => PostModule),
  ],
  controllers: [TimelineMarkController],
  providers: [
    { provide: ITimelineMarkService, useClass: TimelineMarkService },
    { provide: ITimelineMarkRepository, useClass: TimelineMarkRepository },
  ],
  exports: [ITimelineMarkService],
})
export class TimelineMarkModule {}
