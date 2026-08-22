import { ChatMessage } from '../entity/chat-message.entity';
import { ChatMessageView } from '../dto/chat-message-view.dto';

export abstract class IChatMessageRepository {
  abstract create(message: Partial<ChatMessage>): Promise<ChatMessage>;
  abstract findAllWithAuthor(): Promise<ChatMessageView[]>;
}
