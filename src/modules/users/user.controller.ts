import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { IUserService } from './interface/user.service.interface';
import { UpdateStatusMessageDto } from './dto/update-status-message.dto';
import { UpdateProfileImageDto } from './dto/update-profile-image.dto';
import { User } from './entity/user.entity';
import { IPostService } from '../posts/interface/post.service.interface';
import { PostResponseDto } from '../posts/dto/post-response.dto';

@ApiTags('me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class UserController {
  constructor(
    private readonly userService: IUserService,
    private readonly postService: IPostService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '내 프로필 조회',
    description: '로그인한 사용자 본인의 프로필을 반환한다.',
  })
  @ApiResponse({ status: 200, description: '내 프로필', type: User })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  getMyProfile(@CurrentUser() currentUser: AuthenticatedUser): Promise<User> {
    return this.userService.getMyProfile(currentUser.id);
  }

  @Get('posts')
  @ApiOperation({
    summary: '내가 쓴 글 목록',
    description: '로그인한 사용자가 작성한 게시물 목록을 최신순으로 반환한다.',
  })
  @ApiResponse({ status: 200, description: '내가 쓴 글 목록', type: [PostResponseDto] })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  async getMyPosts(
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<PostResponseDto[]> {
    const posts = await this.postService.findAllByAuthor(currentUser.id);
    return this.postService.toResponseDtoList(posts);
  }

  @Patch('status')
  @ApiOperation({
    summary: '상태메시지 수정',
    description: '마이페이지 상태메시지를 수정한다 (최대 100자).',
  })
  @ApiResponse({ status: 200, description: '수정된 프로필', type: User })
  @ApiResponse({ status: 400, description: '100자 초과 등 유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  updateStatusMessage(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() updateStatusMessageDto: UpdateStatusMessageDto,
  ): Promise<User> {
    return this.userService.updateStatusMessage(
      currentUser.id,
      updateStatusMessageDto.statusMessage,
    );
  }

  @Patch('profile-image')
  @ApiOperation({
    summary: '프로필 사진 수정',
    description:
      '/files/upload로 업로드해서 받은 URL을 프로필 사진으로 등록한다.',
  })
  @ApiResponse({ status: 200, description: '수정된 프로필', type: User })
  @ApiResponse({ status: 400, description: '유효하지 않은 URL' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  updateProfileImage(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() updateProfileImageDto: UpdateProfileImageDto,
  ): Promise<User> {
    return this.userService.updateProfileImage(
      currentUser.id,
      updateProfileImageDto.profileImageUrl,
    );
  }
}
