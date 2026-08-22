import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IUserService } from './interface/user.service.interface';
import { UserProfileView } from './dto/user-profile-view.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserDirectoryController {
  constructor(private readonly userService: IUserService) {}

  @Get()
  @ApiOperation({
    summary: '팀원 목록 조회',
    description:
      '로그인한 사용자면 누구나 조회 가능. 이메일 등 민감정보는 제외하고 닉네임·상태메시지만 반환한다.',
  })
  @ApiResponse({ status: 200, description: '팀원 목록', type: [UserProfileView] })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  findAll(): Promise<UserProfileView[]> {
    return this.userService.findAllProfiles();
  }
}
