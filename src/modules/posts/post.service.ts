import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { IPostService } from './interface/post.service.interface';
import {
  IPostRepository,
  PostFileInput,
  PostListFilter,
} from './interface/post.repository.interface';
import { Post } from './entity/post.entity';
import { PostFileType } from './entity/post-file-type.enum';
import { PostResponseDto } from './dto/post-response.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ITagService } from '../tags/interface/tag.service.interface';
import { ICommentService } from '../comments/interface/comment.service.interface';
import { ITimelineMarkService } from '../timeline-marks/interface/timeline-mark.service.interface';
import { UserRole } from '../../common/types/user-role.enum';
import { ERROR_MESSAGE } from '../../common/constants';

@Injectable()
export class PostService extends IPostService {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly tagService: ITagService,
    @Inject(forwardRef(() => ICommentService))
    private readonly commentService: ICommentService,
    @Inject(forwardRef(() => ITimelineMarkService))
    private readonly timelineMarkService: ITimelineMarkService,
  ) {
    super();
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    if (createPostDto.tagId) {
      await this.tagService.getExistingTag(createPostDto.tagId);
    }

    return this.postRepository.create(
      {
        authorId: createPostDto.authorId,
        boardType: createPostDto.boardType,
        tagId: createPostDto.tagId ?? null,
        title: createPostDto.title,
        content: createPostDto.content,
      },
      this.buildFileInputs(
        createPostDto.imageUrls,
        createPostDto.musicUrl,
        createPostDto.videoUrl,
      ),
    );
  }

  findAll(filter: PostListFilter): Promise<Post[]> {
    return this.postRepository.findAll(filter);
  }

  findAllByAuthor(authorId: number): Promise<Post[]> {
    return this.postRepository.findAllByAuthorId(authorId);
  }

  async findById(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGE.POST_NOT_FOUND);
    }
    return post;
  }

  async getOwnedPost(
    userId: number,
    postId: number,
    role: UserRole,
  ): Promise<Post> {
    const post = await this.findById(postId);
    if (post.authorId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException(ERROR_MESSAGE.POST_FORBIDDEN);
    }
    return post;
  }

  async update(
    postId: number,
    updatePostDto: UpdatePostDto,
    role: UserRole,
  ): Promise<Post> {
    const post = await this.getOwnedPost(
      updatePostDto.authorId,
      postId,
      role,
    );

    if (updatePostDto.tagId) {
      await this.tagService.getExistingTag(updatePostDto.tagId);
    }

    const {
      authorId: _authorId,
      imageUrls,
      musicUrl,
      videoUrl,
      ...fields
    } = updatePostDto;
    Object.assign(post, fields);
    await this.postRepository.save(post);

    if (imageUrls !== undefined) {
      await this.postRepository.replaceFilesByType(
        postId,
        PostFileType.IMAGE,
        imageUrls,
      );
    }
    if (musicUrl !== undefined) {
      await this.postRepository.replaceFilesByType(
        postId,
        PostFileType.MUSIC,
        musicUrl ? [musicUrl] : [],
      );
    }
    if (videoUrl !== undefined) {
      await this.postRepository.replaceFilesByType(
        postId,
        PostFileType.VIDEO,
        videoUrl ? [videoUrl] : [],
      );
    }

    return this.findById(postId);
  }

  async remove(userId: number, postId: number, role: UserRole): Promise<void> {
    const post = await this.getOwnedPost(userId, postId, role);
    // CASCADE 결정: 게시물을 지우면 딸린 댓글·시분초 마크도 함께 지운다 (첨부파일은 DB FK CASCADE)
    await this.commentService.removeAllByPost(postId);
    await this.timelineMarkService.removeAllByPost(postId);
    await this.postRepository.remove(post);
  }

  toResponseDto(post: Post): PostResponseDto {
    const files = post.files ?? [];
    return {
      id: post.id,
      authorId: post.authorId,
      boardType: post.boardType,
      tagId: post.tagId,
      title: post.title,
      content: post.content,
      imageUrls: files
        .filter((file) => file.type === PostFileType.IMAGE)
        .map((file) => file.url),
      musicUrl:
        files.find((file) => file.type === PostFileType.MUSIC)?.url ?? null,
      videoUrl:
        files.find((file) => file.type === PostFileType.VIDEO)?.url ?? null,
      createdAt: post.createdAt,
    };
  }

  toResponseDtoList(posts: Post[]): PostResponseDto[] {
    return posts.map((post) => this.toResponseDto(post));
  }

  private buildFileInputs(
    imageUrls: string[] | undefined,
    musicUrl: string | undefined,
    videoUrl: string | undefined,
  ): PostFileInput[] {
    return [
      ...(imageUrls ?? []).map((url) => ({ type: PostFileType.IMAGE, url })),
      ...(musicUrl ? [{ type: PostFileType.MUSIC, url: musicUrl }] : []),
      ...(videoUrl ? [{ type: PostFileType.VIDEO, url: videoUrl }] : []),
    ];
  }
}
