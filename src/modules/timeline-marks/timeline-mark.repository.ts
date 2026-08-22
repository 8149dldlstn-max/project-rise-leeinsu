import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITimelineMarkRepository } from './interface/timeline-mark.repository.interface';
import { TimelineMark } from './entity/timeline-mark.entity';

@Injectable()
export class TimelineMarkRepository extends ITimelineMarkRepository {
  constructor(
    @InjectRepository(TimelineMark)
    private readonly timelineMarkRepository: Repository<TimelineMark>,
  ) {
    super();
  }

  create(mark: Partial<TimelineMark>): Promise<TimelineMark> {
    return this.timelineMarkRepository.save(
      this.timelineMarkRepository.create(mark),
    );
  }

  findById(id: number): Promise<TimelineMark | null> {
    return this.timelineMarkRepository.findOne({ where: { id } });
  }

  findAllByPostId(postId: number): Promise<TimelineMark[]> {
    return this.timelineMarkRepository.find({
      where: { postId },
      order: { timestampSec: 'ASC' },
    });
  }

  save(mark: TimelineMark): Promise<TimelineMark> {
    return this.timelineMarkRepository.save(mark);
  }

  async remove(mark: TimelineMark): Promise<void> {
    await this.timelineMarkRepository.remove(mark);
  }

  async removeAllByPostId(postId: number): Promise<void> {
    await this.timelineMarkRepository.delete({ postId });
  }
}
