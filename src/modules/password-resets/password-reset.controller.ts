import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPasswordResetService } from './interface/password-reset.service.interface';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { PasswordResetRequest } from './entity/password-reset-request.entity';

@ApiTags('password-reset')
@Controller('auth/password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: IPasswordResetService) {}

  @Post('request')
  @ApiOperation({
    summary: '비밀번호 재설정 요청',
    description:
      '이메일로 재설정을 요청한다. 실제 재설정 코드는 자동 발송되지 않고, 어드민이 수동으로 발급한다.',
  })
  @ApiResponse({
    status: 201,
    description: '생성된 요청',
    type: PasswordResetRequest,
  })
  @ApiResponse({ status: 404, description: '존재하지 않는 이메일' })
  request(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ): Promise<PasswordResetRequest> {
    return this.passwordResetService.requestReset(requestPasswordResetDto.email);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '비밀번호 재설정 확인',
    description: '어드민이 발급한 코드로 새 비밀번호를 설정한다.',
  })
  @ApiResponse({ status: 200, description: '재설정 성공' })
  @ApiResponse({
    status: 400,
    description: '코드가 유효하지 않거나 비밀번호 확인이 일치하지 않음',
  })
  confirm(
    @Body() confirmPasswordResetDto: ConfirmPasswordResetDto,
  ): Promise<void> {
    return this.passwordResetService.confirmReset(confirmPasswordResetDto);
  }
}
