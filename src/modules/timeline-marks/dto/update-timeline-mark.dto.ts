import { PartialType } from '@nestjs/swagger';
import { CreateTimelineMarkDto } from './create-timeline-mark.dto';

export class UpdateTimelineMarkDto extends PartialType(CreateTimelineMarkDto) {
  // PartialType이 authorId도 optional로 만들어버리므로 다시 필수로 재선언
  authorId: number;
}
