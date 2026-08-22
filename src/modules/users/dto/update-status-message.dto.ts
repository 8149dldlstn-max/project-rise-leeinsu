import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { STATUS_MESSAGE_MAX_LENGTH } from '../../../common/constants';

export class UpdateStatusMessageDto {
  @ApiProperty({ maxLength: STATUS_MESSAGE_MAX_LENGTH, example: '작업 중 🎧' })
  @IsString()
  @MaxLength(STATUS_MESSAGE_MAX_LENGTH)
  statusMessage: string;
}
