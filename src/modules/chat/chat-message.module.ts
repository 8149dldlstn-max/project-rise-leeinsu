import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entity/chat-message.entity';
import { ChatMessageRepository } from './chat-message.repository';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { IChatMessageRepository } from './interface/chat-message.repository.interface';
import { IChatMessageService } from './interface/chat-message.service.interface';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage]), UserModule],
  controllers: [ChatMessageController],
  providers: [
    { provide: IChatMessageService, useClass: ChatMessageService },
    { provide: IChatMessageRepository, useClass: ChatMessageRepository },
  ],
})
export class ChatMessageModule {}
