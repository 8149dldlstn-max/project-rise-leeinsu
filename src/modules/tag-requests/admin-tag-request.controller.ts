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
import { ITagRequestService } from './interface/tag-request.service.interface';
import { TagRequest } from './entity/tag-request.entity';

@ApiTags('admin-tag-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/tag-requests')
export class AdminTagRequestController {
  constructor(private readonly tagRequestService: ITagRequestService) {}

  @Get()
  @ApiOperation({
    summary: '태그 요청 목록 조회 (관리자 전용)',
    description: '전체 태그 요청(대기/승인/거절)을 최신순으로 반환한다.',
  })
  @ApiResponse({ status: 200, description: '태그 요청 목록', type: [TagRequest] })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '관리자가 아님' })
  findAll(): Promise<TagRequest[]> {
    return this.tagRequestService.findAll();
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: '태그 요청 승인 (관리자 전용)',
    description: '승인하면 고정 태그 목록(Tag)에 자동으로 반영된다.',
  })
  @ApiResponse({ status: 200, description: '승인된 요청', type: TagRequest })
  @ApiResponse({ status: 400, description: '이미 처리된 요청' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '관리자가 아님' })
  @ApiResponse({ status: 404, description: '요청이 존재하지 않음' })
  approve(@Param('id', ParseIntPipe) id: number): Promise<TagRequest> {
    return this.tagRequestService.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: '태그 요청 거절 (관리자 전용)' })
  @ApiResponse({ status: 200, description: '거절된 요청', type: TagRequest })
  @ApiResponse({ status: 400, description: '이미 처리된 요청' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '관리자가 아님' })
  @ApiResponse({ status: 404, description: '요청이 존재하지 않음' })
  reject(@Param('id', ParseIntPipe) id: number): Promise<TagRequest> {
    return this.tagRequestService.reject(id);
  }
}
