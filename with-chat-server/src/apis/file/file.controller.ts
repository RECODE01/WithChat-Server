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
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('파일 업로드 API')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: '파일 업로드 성공',
    schema: {
      example: {
        success: true,
        url: `https://storage.googleapis.com/withchat/asdasdasd`,
      },
    },
  })
  @Bind(UploadedFile())
  uploadFile(file: Express.Multer.File, @Res() res: Response) {
    return this.fileService.uploadFile(file, res);
  }
}
