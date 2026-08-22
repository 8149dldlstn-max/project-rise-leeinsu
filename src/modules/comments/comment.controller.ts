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
import { ICommentService } from './interface/comment.service.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entity/comment.entity';

@ApiTags('comments')
@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: ICommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '댓글/대댓글 작성',
    description:
      'parentId를 지정하면 대댓글이 된다. 부모 댓글은 반드시 같은 게시물에 속해야 한다.',
  })
  @ApiResponse({ status: 201, description: '작성된 댓글', type: Comment })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({
    status: 404,
    description: '게시물이 존재하지 않거나, 부모 댓글을 찾을 수 없음',
  })
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    createCommentDto.authorId = currentUser.id;
    return this.commentService.create(postId, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: '댓글 목록 조회' })
  @ApiResponse({ status: 200, description: '댓글 목록', type: [Comment] })
  @ApiResponse({ status: 404, description: '게시물이 존재하지 않음' })
  findAll(@Param('postId', ParseIntPipe) postId: number): Promise<Comment[]> {
    return this.commentService.findAllByPost(postId);
  }

  @Patch(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '댓글 수정',
    description: '작성자 본인 또는 관리자만 수정할 수 있다.',
  })
  @ApiResponse({ status: 200, description: '수정된 댓글', type: Comment })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '본인의 댓글이 아님' })
  @ApiResponse({ status: 404, description: '댓글이 존재하지 않음' })
  update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    updateCommentDto.authorId = currentUser.id;
    return this.commentService.update(
      postId,
      commentId,
      updateCommentDto,
      currentUser.role,
    );
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '댓글 삭제',
    description:
      '작성자 본인 또는 관리자만 삭제할 수 있다. 대댓글도 함께 삭제된다(CASCADE).',
  })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '본인의 댓글이 아님' })
  @ApiResponse({ status: 404, description: '댓글이 존재하지 않음' })
  remove(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<void> {
    return this.commentService.remove(
      postId,
      commentId,
      currentUser.id,
      currentUser.role,
    );
  }
}
