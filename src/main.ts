import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
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

  await app.listen(process.env.PORT ?? 5001)
}
bootstrap()
