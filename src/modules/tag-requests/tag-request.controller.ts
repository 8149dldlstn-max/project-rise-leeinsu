import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { ITagRequestService } from './interface/tag-request.service.interface';
import { CreateTagRequestDto } from './dto/create-tag-request.dto';
import { TagRequest } from './entity/tag-request.entity';

@ApiTags('tag-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tag-requests')
export class TagRequestController {
  constructor(private readonly tagRequestService: ITagRequestService) {}

  @Post()
  @ApiOperation({
    summary: '신규 태그 요청',
    description:
      '고정 태그 목록에 없는 태그를 요청한다. 어드민이 승인하면 고정 목록에 자동 반영된다.',
  })
  @ApiResponse({ status: 201, description: '생성된 요청', type: TagRequest })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() createTagRequestDto: CreateTagRequestDto,
  ): Promise<TagRequest> {
    createTagRequestDto.requesterId = currentUser.id;
    return this.tagRequestService.create(createTagRequestDto);
  }
}
