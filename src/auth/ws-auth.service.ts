import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class WsAuthService {
  constructor(private prisma: PrismaService) {}

  async validateSessionFromCookie(cookie?: string) {
    if (!cookie) return null

    const sessionId = this.extractSessionId(cookie)
    if (!sessionId) return null

    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        revokedAt: null,
        expiredAt: { gt: new Date() },
      },
    })
    return session ?? null
  }
  private extractSessionId(cookie: string): string | null {
    const match = cookie.match(/sessionId=([^;]+)/)
    return match ? match[1] : null
  }
}
