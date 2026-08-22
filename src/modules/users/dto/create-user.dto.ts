import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../../../common/decorators/match.decorator';
import {
  ERROR_MESSAGE,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
} from '../../../common/constants';

export class CreateUserDto {
  @ApiProperty({ example: 'kim@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ minLength: 6, example: 'password123' })
  @IsString()
  @Match('password', { message: ERROR_MESSAGE.PASSWORD_CONFIRM_NOT_MATCH })
  passwordConfirm: string;

  @ApiProperty({
    required: false,
    example: '김철수',
    minLength: NICKNAME_MIN_LENGTH,
    maxLength: NICKNAME_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MinLength(NICKNAME_MIN_LENGTH)
  @MaxLength(NICKNAME_MAX_LENGTH)
  @Matches(/^[^<>]*$/, { message: ERROR_MESSAGE.NICKNAME_INVALID_CHARACTERS })
  nickname?: string;
}
