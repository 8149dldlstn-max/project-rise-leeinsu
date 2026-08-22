import { TimelineMark } from '../entity/timeline-mark.entity';
import { CreateTimelineMarkDto } from '../dto/create-timeline-mark.dto';
import { UpdateTimelineMarkDto } from '../dto/update-timeline-mark.dto';
import { UserRole } from '../../../common/types/user-role.enum';

export abstract class ITimelineMarkService {
  abstract create(
    postId: number,
    createTimelineMarkDto: CreateTimelineMarkDto,
  ): Promise<TimelineMark>;
  abstract findAllByPost(postId: number): Promise<TimelineMark[]>;
  abstract update(
    postId: number,
    markId: number,
    updateTimelineMarkDto: UpdateTimelineMarkDto,
    role: UserRole,
  ): Promise<TimelineMark>;
  abstract remove(
    postId: number,
    markId: number,
    userId: number,
    role: UserRole,
  ): Promise<void>;
  abstract removeAllByPost(postId: number): Promise<void>;
}
