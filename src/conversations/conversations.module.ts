import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ConversationsController } from './conversations.controller'
import { ConversationsService } from './conversations.service'
import { AuthModule } from 'src/auth/auth.module'
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
