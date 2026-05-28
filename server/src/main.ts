import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
  origin: 'http://localhost:5173', // 정확히 이 주소인지 확인
  credentials: true,               // 쿠키나 세션을 사용한다면 필수
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
