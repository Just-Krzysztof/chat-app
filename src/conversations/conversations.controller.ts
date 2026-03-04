import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { SessionGuard } from 'src/auth/session.guard'
import { Request } from 'express'
import { ConversationsService } from './conversations.service'

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}
  @Get()
  @UseGuards(SessionGuard)
  async getMyConversations(@Req() req: Request) {
    return this.conversationsService.getUserConversation(req.user?.id as string)
  }

  @Get(':id/messages')
  @UseGuards(SessionGuard)
  async getMessagesFromConversation(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    return this.conversationsService.getMessageFromConversation(
      req.user?.id as string,
      id
    )
  }

  @Post('direct/:userId')
  @UseGuards(SessionGuard)
  createDirect(@Req() req: Request, @Param('userId') userId: string) {
    return this.conversationsService.createDirectConversation(
      req.user?.id as string,
      userId
    )
  }
}
