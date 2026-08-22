import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ITimelineMarkService } from './interface/timeline-mark.service.interface';
import { ITimelineMarkRepository } from './interface/timeline-mark.repository.interface';
import { TimelineMark } from './entity/timeline-mark.entity';
import { CreateTimelineMarkDto } from './dto/create-timeline-mark.dto';
import { UpdateTimelineMarkDto } from './dto/update-timeline-mark.dto';
import { IPostService } from '../posts/interface/post.service.interface';
import { BoardType } from '../posts/entity/board-type.enum';
import { UserRole } from '../../common/types/user-role.enum';
import { ERROR_MESSAGE } from '../../common/constants';

@Injectable()
export class TimelineMarkService extends ITimelineMarkService {
  constructor(
    private readonly timelineMarkRepository: ITimelineMarkRepository,
    private readonly postService: IPostService,
  ) {
    super();
  }

  async create(
    postId: number,
    createTimelineMarkDto: CreateTimelineMarkDto,
  ): Promise<TimelineMark> {
    const post = await this.postService.findById(postId);
    if (post.boardType !== BoardType.WORK) {
      throw new BadRequestException(ERROR_MESSAGE.MARK_BOARD_TYPE_INVALID);
    }

    return this.timelineMarkRepository.create({
      postId,
      authorId: createTimelineMarkDto.authorId,
      timestampSec: createTimelineMarkDto.timestampSec,
      kind: createTimelineMarkDto.kind,
      tag: createTimelineMarkDto.tag ?? null,
      emoji: createTimelineMarkDto.emoji ?? null,
      content: createTimelineMarkDto.content ?? null,
    });
  }

  async findAllByPost(postId: number): Promise<TimelineMark[]> {
    await this.postService.findById(postId);
    return this.timelineMarkRepository.findAllByPostId(postId);
  }

  private async getOwnedMark(
    postId: number,
    markId: number,
    userId: number,
    role: UserRole,
  ): Promise<TimelineMark> {
    const mark = await this.timelineMarkRepository.findById(markId);
    if (!mark || mark.postId !== postId) {
      throw new NotFoundException(ERROR_MESSAGE.MARK_NOT_FOUND);
    }
    if (mark.authorId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException(ERROR_MESSAGE.MARK_FORBIDDEN);
    }
    return mark;
  }

  async update(
    postId: number,
    markId: number,
    updateTimelineMarkDto: UpdateTimelineMarkDto,
    role: UserRole,
  ): Promise<TimelineMark> {
    const mark = await this.getOwnedMark(
      postId,
      markId,
      updateTimelineMarkDto.authorId,
      role,
    );

    if (updateTimelineMarkDto.timestampSec !== undefined) {
      mark.timestampSec = updateTimelineMarkDto.timestampSec;
    }
    if (updateTimelineMarkDto.kind !== undefined) {
      mark.kind = updateTimelineMarkDto.kind;
    }
    if (updateTimelineMarkDto.tag !== undefined) {
      mark.tag = updateTimelineMarkDto.tag;
    }
    if (updateTimelineMarkDto.emoji !== undefined) {
      mark.emoji = updateTimelineMarkDto.emoji;
    }
    if (updateTimelineMarkDto.content !== undefined) {
      mark.content = updateTimelineMarkDto.content;
    }

    return this.timelineMarkRepository.save(mark);
  }

  async remove(
    postId: number,
    markId: number,
    userId: number,
    role: UserRole,
  ): Promise<void> {
    const mark = await this.getOwnedMark(postId, markId, userId, role);
    await this.timelineMarkRepository.remove(mark);
  }

  removeAllByPost(postId: number): Promise<void> {
    return this.timelineMarkRepository.removeAllByPostId(postId);
  }
}
