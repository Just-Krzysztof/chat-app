import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
    allowedHeaders: [
      'Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Origin',
    ],
  })
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Chat API')
      .setDescription('Api documentation for chat application')
      .setVersion('1.0')
      .addCookieAuth('connect.sid')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removed fileds which are not in DTO
      forbidNonWhitelisted: true, // throw error when find unknow field
      transform: true, // convert plain object to class
    })
  )

  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 5001)
}
bootstrap()
