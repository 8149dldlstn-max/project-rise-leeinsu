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
  Post as HttpPost,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { IPostService } from './interface/post.service.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { BoardType } from './entity/board-type.enum';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: IPostService) {}

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '게시물 작성',
    description:
      '작업물공간(WORK) 또는 자유게시판(FREE)에 게시물을 작성한다. 작성자는 로그인 토큰에서 주입되며, body로 authorId를 보내도 무시된다.',
  })
  @ApiResponse({ status: 201, description: '작성된 게시물', type: PostResponseDto })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 404, description: '존재하지 않는 태그(tagId)' })
  async create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    createPostDto.authorId = currentUser.id;
    const post = await this.postService.create(createPostDto);
    return this.postService.toResponseDto(post);
  }

  @Get()
  @ApiOperation({
    summary: '게시물 목록 조회',
    description: 'boardType, tagId로 필터링할 수 있다. 로그인 없이 조회 가능.',
  })
  @ApiQuery({ name: 'boardType', enum: BoardType, required: false })
  @ApiQuery({ name: 'tagId', type: Number, required: false })
  @ApiResponse({ status: 200, description: '게시물 목록', type: [PostResponseDto] })
  async findAll(
    @Query('boardType') boardType?: BoardType,
    @Query('tagId') tagId?: string,
  ): Promise<PostResponseDto[]> {
    const posts = await this.postService.findAll({
      boardType,
      tagId: tagId ? Number(tagId) : undefined,
    });
    return this.postService.toResponseDtoList(posts);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시물 상세 조회' })
  @ApiResponse({ status: 200, description: '게시물 상세', type: PostResponseDto })
  @ApiResponse({ status: 404, description: '게시물이 존재하지 않음' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto> {
    const post = await this.postService.findById(id);
    return this.postService.toResponseDto(post);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '게시물 수정',
    description: '작성자 본인 또는 관리자만 수정할 수 있다.',
  })
  @ApiResponse({ status: 200, description: '수정된 게시물', type: PostResponseDto })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '본인의 게시물이 아님' })
  @ApiResponse({ status: 404, description: '게시물이 존재하지 않음' })
  async update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    updatePostDto.authorId = currentUser.id;
    const post = await this.postService.update(
      id,
      updatePostDto,
      currentUser.role,
    );
    return this.postService.toResponseDto(post);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '게시물 삭제',
    description:
      '작성자 본인 또는 관리자만 삭제할 수 있다. 삭제 시 딸린 댓글·시분초 마크도 함께 삭제된다(CASCADE).',
  })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  @ApiResponse({ status: 403, description: '본인의 게시물이 아님' })
  @ApiResponse({ status: 404, description: '게시물이 존재하지 않음' })
  remove(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.postService.remove(currentUser.id, id, currentUser.role);
  }
}
