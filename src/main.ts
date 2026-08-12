import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const process: {
  env: Record<string, string | undefined>;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
