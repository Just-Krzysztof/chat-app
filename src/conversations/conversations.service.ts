import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}
  async getUserConversation(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getMessageFromConversation(userId: string, conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
        conversation: {
          participants: {
            some: { userId },
          },
        },
      },
      orderBy: { createAt: 'desc' },
      take: 30,
    })
  }
}
