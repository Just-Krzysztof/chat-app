import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ConversationsController } from './conversations.controller'
import { ConversationsService } from './conversations.service'
import { ChatGateway } from './gateway/chat.gateway'
import { AuthModule } from 'src/auth/auth.module'
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ChatGateway],
})
export class ConversationsModule {}
