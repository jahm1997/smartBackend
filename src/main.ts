import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://smart-delta.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle("user")
    .setDescription("Consumo del CRUD {get,post,put}")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app,options);

  SwaggerModule.setup("/api",app,document);

  await app.listen(3000).then(()=>"--> 👌 Server Online in port " + 3001)
}
bootstrap();
