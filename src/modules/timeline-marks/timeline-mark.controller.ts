import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { ITimelineMarkService } from './interface/timeline-mark.service.interface';
import { CreateTimelineMarkDto } from './dto/create-timeline-mark.dto';
import { UpdateTimelineMarkDto } from './dto/update-timeline-mark.dto';
import { TimelineMark } from './entity/timeline-mark.entity';

@ApiTags('timeline-marks')
@Controller('posts/:postId/marks')
export class TimelineMarkController {
  constructor(private readonly timelineMarkService: ITimelineMarkService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '시분초 마크 작성',
    description:
      '작업물공간(WORK) 게시물에서만 가능하다. kind(TAG/EMOJI/COMMENT)에 대응하는 필드(tag/emoji/content)가 필요하다.',
  })
  @ApiResponse({ status: 201, description: '작성된 마크', type: TimelineMark })
  @ApiResponse({
    status: 400,
    description: 'FREE 게시물이거나 kind에 맞는 필드가 없음',
  })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 404, description: '게시물이 존재하지 않음' })
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createTimelineMarkDto: CreateTimelineMarkDto,
  ): Promise<TimelineMark> {
    createTimelineMarkDto.authorId = currentUser.id;
    return this.timelineMarkService.create(postId, createTimelineMarkDto);
  }

  @Get()
  @ApiOperation({ summary: '시분초 마크 목록 조회' })
  @ApiResponse({ status: 200, description: '마크 목록', type: [TimelineMark] })
  @ApiResponse({ status: 404, description: '게시물이 존재하지 않음' })
  findAll(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<TimelineMark[]> {
    return this.timelineMarkService.findAllByPost(postId);
  }

  @Patch(':markId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '시분초 마크 수정',
    description: '작성자 본인 또는 관리자만 수정할 수 있다.',
  })
  @ApiResponse({ status: 200, description: '수정된 마크', type: TimelineMark })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '본인의 마크가 아님' })
  @ApiResponse({ status: 404, description: '마크가 존재하지 않음' })
  update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('markId', ParseIntPipe) markId: number,
    @Body() updateTimelineMarkDto: UpdateTimelineMarkDto,
  ): Promise<TimelineMark> {
    updateTimelineMarkDto.authorId = currentUser.id;
    return this.timelineMarkService.update(
      postId,
      markId,
      updateTimelineMarkDto,
      currentUser.role,
    );
  }

  @Delete(':markId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '시분초 마크 삭제',
    description: '작성자 본인 또는 관리자만 삭제할 수 있다.',
  })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '본인의 마크가 아님' })
  @ApiResponse({ status: 404, description: '마크가 존재하지 않음' })
  remove(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('markId', ParseIntPipe) markId: number,
  ): Promise<void> {
    return this.timelineMarkService.remove(
      postId,
      markId,
      currentUser.id,
      currentUser.role,
    );
  }
}
