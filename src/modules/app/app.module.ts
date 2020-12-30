import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from '../../schemas/contact.schema';
import { ContactModule } from '../contact/contact.module';
import DatabaseModule from '../database/database-test.module';
import { LoggingInterceptor } from '@algoan/nestjs-logging-interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule({
      connectionName: (new Date().getTime() * Math.random()).toString(16),
    }),
    MongooseModule.forFeature([{ name: 'Prod', schema: ContactSchema }]),
    ContactModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
