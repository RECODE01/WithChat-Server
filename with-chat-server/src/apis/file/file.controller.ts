import {
  Controller,
  Post,
  UseInterceptors,
  Bind,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Bind(UploadedFile())
  uploadFile(file: Express.Multer.File, @Res() res: Response) {
    console.log(file);
    return this.fileService.uploadFile(file, res);
  }
}
