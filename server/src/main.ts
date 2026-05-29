import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: 'http://localhost:5173', // 정확히 이 주소인지 확인
    credentials: true,               // 쿠키나 세션을 사용한다면 필수
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
