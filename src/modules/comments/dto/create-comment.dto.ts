import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false, description: '대댓글인 경우 부모 댓글 id' })
  @IsOptional()
  @IsInt()
  parentId?: number;

  // 클라이언트 입력이 아니라 컨트롤러가 @CurrentUser로 주입.
  // 검증 데코레이터·@ApiProperty 없음 — whitelist가 클라이언트가 보낸 값은 제거.
  authorId: number;
}
