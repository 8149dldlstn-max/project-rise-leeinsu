import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Match } from '../../../common/decorators/match.decorator';
import { ERROR_MESSAGE, PASSWORD_RESET_CODE_LENGTH } from '../../../common/constants';

export class ConfirmPasswordResetDto {
  @ApiProperty({ example: 'kim@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: PASSWORD_RESET_CODE_LENGTH,
    maxLength: PASSWORD_RESET_CODE_LENGTH,
    description: '어드민이 발급한 코드',
  })
  @IsString()
  code: string;

  @ApiProperty({ minLength: 6, example: 'newPassword123' })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ minLength: 6, example: 'newPassword123' })
  @IsString()
  @Match('newPassword', { message: ERROR_MESSAGE.PASSWORD_CONFIRM_NOT_MATCH })
  newPasswordConfirm: string;
}
