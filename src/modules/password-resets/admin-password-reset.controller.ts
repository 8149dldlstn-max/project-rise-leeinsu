import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/user-role.enum';
import { IPasswordResetService } from './interface/password-reset.service.interface';
import { PasswordResetRequestView } from './dto/password-reset-request-view.dto';
import { PasswordResetRequest } from './entity/password-reset-request.entity';

@ApiTags('admin-password-reset-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/password-reset-requests')
export class AdminPasswordResetController {
  constructor(private readonly passwordResetService: IPasswordResetService) {}

  @Get()
  @ApiOperation({
    summary: '비밀번호 재설정 요청 목록 조회 (관리자 전용)',
    description: '요청한 사용자의 이메일·닉네임과 함께 목록을 반환한다.',
  })
  @ApiResponse({
    status: 200,
    description: '재설정 요청 목록',
    type: [PasswordResetRequestView],
  })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '관리자가 아님' })
  findAll(): Promise<PasswordResetRequestView[]> {
    return this.passwordResetService.findAll();
  }

  @Patch(':id/issue-code')
  @ApiOperation({
    summary: '재설정 코드 발급 (관리자 전용)',
    description: '임의의 6자리 코드를 생성해 해당 요청에 발급한다.',
  })
  @ApiResponse({
    status: 200,
    description: '코드가 발급된 요청',
    type: PasswordResetRequest,
  })
  @ApiResponse({ status: 400, description: '이미 처리된 요청' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '관리자가 아님' })
  @ApiResponse({ status: 404, description: '요청이 존재하지 않음' })
  issueCode(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PasswordResetRequest> {
    return this.passwordResetService.issueCode(id);
  }
}
