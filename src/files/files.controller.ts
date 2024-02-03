import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { myFile } from './intefaces/file.interface';
import { audio, video, doc, code, image } from '../type/fileType';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'node:fs';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  allType = [
    { name: 'audio', data: audio, path: '/home/eddy/Musique' },
    { name: 'video', data: video, path: '/home/eddy/Vidéos' },
    { name: 'doc', data: doc, path: '/home/eddy/Documents' },
    { name: 'code', data: code, path: '/home/eddy/Documents' },
    { name: 'image', data: image, path: '/home/eddy/Images' },
  ];

  constructor(private readonly fileService: FilesService) {}
  @Post('/directory')
  readDirectory(@Body('path') path: string): Promise<myFile[]> {
    return this.fileService.loadOneDirectory(path);
  }

  @Get('/get/:type')
  readAllDirectory(@Param('type') type: string): Promise<myFile[]> {
    const data = this.allType.find(function (item) {
      return item.name === type;
    });

    return this.fileService.fileLoader(data.data, data.path);
  }

  @Post('/search')
  searchFiles(
    @Body('name') name: string,
    @Body('path') path: string,
  ): Promise<myFile[]> {

    return this.fileService.searchFiles(name, path);
  }

  @Get('/stream')
  getStreamFile(@Res() res: Response, @Query('path') path: string) {
    const fileStream = createReadStream(path);
    fileStream.pipe(res);
    return new StreamableFile(fileStream);
  }

  @Get('/download')
  downoladFile(@Res() res: Response, @Query('path') path: string) {
    res.sendFile(path);
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callBack) => {
          callBack(null, file.originalname);
        },
      }),
    }),
  )
  uploader(@UploadedFile() file: Express.Multer.File): string {
    return 'file uploaded';
  }
}
