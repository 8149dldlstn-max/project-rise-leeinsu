import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserDirectoryController } from './user-directory.controller';
import { IUserRepository } from './interface/user.repository.interface';
import { IUserService } from './interface/user.service.interface';
import { PostModule } from '../posts/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PostModule],
  controllers: [UserController, UserDirectoryController],
  providers: [
    { provide: IUserService, useClass: UserService },
    { provide: IUserRepository, useClass: UserRepository },
  ],
  exports: [IUserService],
})
export class UserModule {}
