import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TAG_NAME_MAX_LENGTH } from '../../../common/constants';

export class CreateTagRequestDto {
  @ApiProperty({ maxLength: TAG_NAME_MAX_LENGTH, example: '댄스챌린지' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TAG_NAME_MAX_LENGTH)
  name: string;

  // 클라이언트 입력이 아니라 컨트롤러가 @CurrentUser로 주입.
  // 검증 데코레이터·@ApiProperty 없음 — whitelist가 클라이언트가 보낸 값은 제거.
  requesterId: number;
}
