import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { SystemModule } from './system/system.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    FilesModule,
    SystemModule,
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
