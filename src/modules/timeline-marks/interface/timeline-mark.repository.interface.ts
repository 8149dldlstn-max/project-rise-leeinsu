import { TimelineMark } from '../entity/timeline-mark.entity';

export abstract class ITimelineMarkRepository {
  abstract create(mark: Partial<TimelineMark>): Promise<TimelineMark>;
  abstract findById(id: number): Promise<TimelineMark | null>;
  abstract findAllByPostId(postId: number): Promise<TimelineMark[]>;
  abstract save(mark: TimelineMark): Promise<TimelineMark>;
  abstract remove(mark: TimelineMark): Promise<void>;
  abstract removeAllByPostId(postId: number): Promise<void>;
}
