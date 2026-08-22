import { Module } from '@nestjs/common';
import { ConfigWrapperModule } from './configs/config-wrapper.module';
import { TypeOrmWrapperModule } from './configs/typeorm-wrapper.module';
import { TokenModule } from './common/utils/token/token.module';
import { SupabaseClientModule } from './common/utils/supabase/supabase-client.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TagModule } from './modules/tags/tag.module';
import { PostModule } from './modules/posts/post.module';
import { TimelineMarkModule } from './modules/timeline-marks/timeline-mark.module';
import { CommentModule } from './modules/comments/comment.module';
import { ChatMessageModule } from './modules/chat/chat-message.module';
import { TagRequestModule } from './modules/tag-requests/tag-request.module';
import { PasswordResetModule } from './modules/password-resets/password-reset.module';
import { FileModule } from './modules/files/file.module';

@Module({
  imports: [
    ConfigWrapperModule,
    TypeOrmWrapperModule,
    TokenModule,
    SupabaseClientModule,
    UserModule,
    AuthModule,
    TagModule,
    PostModule,
    TimelineMarkModule,
    CommentModule,
    ChatMessageModule,
    TagRequestModule,
    PasswordResetModule,
    FileModule,
  ],
})
export class AppModule {}
