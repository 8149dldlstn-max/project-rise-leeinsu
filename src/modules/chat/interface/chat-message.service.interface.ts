import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
import { ChatMessageView } from '../dto/chat-message-view.dto';

export abstract class IChatMessageService {
  abstract create(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<ChatMessageView>;
  abstract findAll(): Promise<ChatMessageView[]>;
}
