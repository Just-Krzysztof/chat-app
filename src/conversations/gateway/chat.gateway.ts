import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WsAuthService } from 'src/auth/ws-auth.service'
import { PrismaService } from 'src/prisma/prisma.service'

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server

  constructor(
    private wsAuthService: WsAuthService,
    private prisma: PrismaService
  ) {}

  async handleConnection(client: Socket) {
    const session = await this.wsAuthService.validateSessionFromCookie(
      client.handshake.headers.cookie
    )

    if (!session) {
      client.disconnect()
      return
    }
    await this.prisma.user.update({
      where: { id: session?.userId },
      data: { status: 'online' },
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.data.userId = session.userId
    client.join(session.userId)
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    client: Socket,
    payload: { conversationId: string; content: string }
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = client.data.userId as string

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: payload.conversationId,
        participants: {
          some: { userId },
        },
      },
    })

    if (!conversation) return

    const message = await this.prisma.message.create({
      data: {
        content: payload.content,
        senderId: userId,
        conversationId: payload.conversationId,
      },
    })

    await this.prisma.conversation.update({
      where: { id: payload.conversationId },
      data: { lastMessageAt: new Date() },
    })

    this.server.to(payload.conversationId).emit('new-message', message)
  }

  @SubscribeMessage('join-conversation')
  async joinConversation(client: Socket, conversationId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = client.data.userId as string

    const exists = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { userId },
        },
      },
    })

    if (!exists) return

    client.join(conversationId)

    return { success: true }
  }
}
