import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { MarkKind } from '../entity/mark-kind.enum';

export class CreateTimelineMarkDto {
  @ApiProperty({ minimum: 0, description: '몇 초 지점인지' })
  @IsNumber()
  @Min(0)
  timestampSec: number;

  @ApiProperty({ enum: MarkKind })
  @IsEnum(MarkKind)
  kind: MarkKind;

  @ApiProperty({ required: false, description: 'kind=TAG일 때 필수' })
  @ValidateIf((dto: CreateTimelineMarkDto) => dto.kind === MarkKind.TAG)
  @IsString()
  @IsNotEmpty()
  tag?: string;

  @ApiProperty({ required: false, description: 'kind=EMOJI일 때 필수' })
  @ValidateIf((dto: CreateTimelineMarkDto) => dto.kind === MarkKind.EMOJI)
  @IsString()
  @IsNotEmpty()
  emoji?: string;

  @ApiProperty({ required: false, description: 'kind=COMMENT일 때 필수' })
  @ValidateIf((dto: CreateTimelineMarkDto) => dto.kind === MarkKind.COMMENT)
  @IsString()
  @IsNotEmpty()
  content?: string;

  // 클라이언트 입력이 아니라 컨트롤러가 @CurrentUser로 주입.
  // 검증 데코레이터·@ApiProperty 없음 — whitelist가 클라이언트가 보낸 값은 제거.
  authorId: number;
}
