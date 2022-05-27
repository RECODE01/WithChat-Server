import { HttpStatus, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'util';
import { Response } from 'express';
@Injectable()
export class FileService {
  uploadFile(file: Express.Multer.File, res: Response) {
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILE_NAME,
      projectId: process.env.STORAGE_PROJECT_NAME,
    }).bucket(process.env.STORAGE_BUCKET_NAME);

    const fileNmae = uuidv4();
    file.originalname = fileNmae.concat(
      '.',
      file.originalname.split('.')[file.originalname.split('.').length - 1],
    );
    const blob = storage.file(file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        url: `파일 업로드 실패`,
      });
    });
    blobStream.on('finish', () => {
      console.log('isDone');
      res.status(HttpStatus.CREATED).json({
        success: true,
        url: `https://storage.googleapis.com/withchat/${blob.name}`,
      });
      return;
    });
    blobStream.end(file.buffer);
    return;
  }
}
