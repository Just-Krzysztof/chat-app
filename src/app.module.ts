import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, AuthService],
})
export class AppModule {}
