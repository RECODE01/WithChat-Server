import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';
import * as dotenv from 'dotenv';
import * as path from 'path';

// dotenv.config({
//   path: path.resolve('.env'),
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
