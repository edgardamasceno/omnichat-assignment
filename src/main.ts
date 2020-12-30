import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(parseInt(process.env.API_PORT, 10) || 4000);
}

bootstrap()
  .then(() => {
    console.info('APLICAÇÃO INICIADA');
  })
  .catch(console.error);
