import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  // PartialType이 authorId도 optional로 만들어버리므로 다시 필수로 재선언
  authorId: number;
}
