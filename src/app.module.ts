import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { ChatGateway } from './conversations/gateway/chat.gateway'
import { ConversationsController } from './conversations/conversations.controller'
import { ConversationsService } from './conversations/conversations.service'
import { ConversationsModule } from './conversations/conversations.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    ConversationsModule,
  ],
  controllers: [AppController, UserController, ConversationsController],
  providers: [AppService, AuthService, ChatGateway, ConversationsService],
})
export class AppModule {}
