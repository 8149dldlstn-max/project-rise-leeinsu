import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IChatMessageRepository } from './interface/chat-message.repository.interface';
import { ChatMessage } from './entity/chat-message.entity';
import { ChatMessageView } from './dto/chat-message-view.dto';
import { User } from '../users/entity/user.entity';

@Injectable()
export class ChatMessageRepository extends IChatMessageRepository {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {
    super();
  }

  create(message: Partial<ChatMessage>): Promise<ChatMessage> {
    return this.chatMessageRepository.save(
      this.chatMessageRepository.create(message),
    );
  }

  findAllWithAuthor(): Promise<ChatMessageView[]> {
    return this.chatMessageRepository
      .createQueryBuilder('message')
      .leftJoin(User, 'author', 'author.id = message.authorId')
      .select('message.id', 'id')
      .addSelect('message.authorId', 'authorId')
      .addSelect('author.nickname', 'nickname')
      .addSelect('message.content', 'content')
      .addSelect('message.createdAt', 'createdAt')
      .orderBy('message.createdAt', 'ASC')
      .getRawMany<ChatMessageView>();
  }
}
