import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { IChatMessageService } from './interface/chat-message.service.interface';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatMessageView } from './dto/chat-message-view.dto';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat/messages')
export class ChatMessageController {
  constructor(private readonly chatMessageService: IChatMessageService) {}

  @Post()
  @ApiOperation({
    summary: '채팅 메시지 작성',
    description: '전체 공개 채팅방(방 구분 없음)에 메시지를 남긴다.',
  })
  @ApiResponse({
    status: 201,
    description: '작성된 메시지(발신자 닉네임 포함)',
    type: ChatMessageView,
  })
  @ApiResponse({ status: 400, description: '빈 내용' })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() createChatMessageDto: CreateChatMessageDto,
  ): Promise<ChatMessageView> {
    createChatMessageDto.authorId = currentUser.id;
    return this.chatMessageService.create(createChatMessageDto);
  }

  @Get()
  @ApiOperation({
    summary: '채팅 메시지 목록 조회',
    description: '전체 공개 채팅방의 메시지를 시간순으로 반환한다.',
  })
  @ApiResponse({
    status: 200,
    description: '메시지 목록(발신자 닉네임 포함)',
    type: [ChatMessageView],
  })
  @ApiResponse({ status: 401, description: '로그인이 필요함' })
  findAll(): Promise<ChatMessageView[]> {
    return this.chatMessageService.findAll();
  }
}
