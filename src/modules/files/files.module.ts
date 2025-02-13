import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { path } from 'app-root-path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  providers: [FilesService, UserService],
  controllers: [FilesController],
})
export class FilesModule {}
