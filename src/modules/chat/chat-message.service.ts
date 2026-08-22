import { Injectable } from '@nestjs/common';
import { IChatMessageService } from './interface/chat-message.service.interface';
import { IChatMessageRepository } from './interface/chat-message.repository.interface';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatMessageView } from './dto/chat-message-view.dto';
import { IUserService } from '../users/interface/user.service.interface';

@Injectable()
export class ChatMessageService extends IChatMessageService {
  constructor(
    private readonly chatMessageRepository: IChatMessageRepository,
    private readonly userService: IUserService,
  ) {
    super();
  }

  async create(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<ChatMessageView> {
    const author = await this.userService.getMyProfile(
      createChatMessageDto.authorId,
    );
    const message = await this.chatMessageRepository.create({
      authorId: createChatMessageDto.authorId,
      content: createChatMessageDto.content,
    });

    return {
      id: message.id,
      authorId: message.authorId,
      nickname: author.nickname,
      content: message.content,
      createdAt: message.createdAt,
    };
  }

  findAll(): Promise<ChatMessageView[]> {
    return this.chatMessageRepository.findAllWithAuthor();
  }
}
