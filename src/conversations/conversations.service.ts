import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  private generateDirectKey(a: string, b: string) {
    return [a, b].sort().join('_')
  }

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
        lastMessageAt: 'desc',
      },
    })
  }

  async getMessageFromConversation(
    userId: string,
    conversationId: string,
    cursor?: string
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { userId },
        },
      },
    })
    if (!conversation) throw new ForbiddenException('Access denied')

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
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    })
  }

  async createDirectConversation(currentUserId: string, otherUserId: string) {
    if (currentUserId === otherUserId)
      throw new BadRequestException('Cannot caht with yourself')

    const userExists = await this.prisma.user.findUnique({
      where: { id: otherUserId },
    })

    if (!userExists) throw new NotFoundException('User not found')

    const directKey = this.generateDirectKey(currentUserId, otherUserId)

    try {
      return await this.prisma.$transaction(async tx => {
        const existing = await tx.conversation.findUnique({
          where: { directKey },
          include: { participants: true },
        })

        if (existing) return existing

        return tx.conversation.create({
          data: {
            type: 'direct',
            directKey,
            participants: {
              create: [{ userId: currentUserId }, { userId: otherUserId }],
            },
          },
          include: { participants: true },
        })
      })
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2002') {
        return this.prisma.conversation.findUnique({
          where: { directKey },
          include: { participants: true },
        })
      }
      throw error
    }
  }
}
