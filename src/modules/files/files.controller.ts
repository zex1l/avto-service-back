import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResponse } from './dto/file.dto';
import { Authorization } from '../auth/decorators/auth.decorator';
import { UserRoles } from 'prisma/generated';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Authorization(UserRoles.ADMIN)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() files: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<FileResponse[]> {
    return this.filesService.saveFiles([files], folder);
  }
}
