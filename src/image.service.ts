// image.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { promisify } from 'util';
import * as fs from 'fs'; // Import the entire 'fs' module

@Injectable()
export class ImageService {
  private readonly log = new Logger(ImageService.name);
  private uploadDirectory = './uploads';

  constructor(folderName: string) {
    this.uploadDirectory = `${this.uploadDirectory}/${folderName}`;
    this.ensureUploadDirectorySync();
  }

  private ensureUploadDirectorySync(): void {
    try {
      if (!existsSync(this.uploadDirectory)) {
        mkdirSync(this.uploadDirectory, { recursive: true }); // Create the directory and its parents if they don't exist
      }
    } catch (error) {
      // Handle directory creation error
      throw new Error(`Failed to create upload directory: ${error.message}`);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
    const filePath = `${this.uploadDirectory}/${uniqueFilename}`;
    this.log.debug(`Uploading file to ${filePath}`);

    try {
      const writeFileAsync = promisify(
        createWriteStream(filePath).write.bind(createWriteStream(filePath)),
      );
      const readStream = new Readable();
      readStream.push(file.buffer);
      readStream.push(null);

      await writeFileAsync(file.buffer);

      this.log.debug(`Uploaded file to ${filePath}`);
      return uniqueFilename;
    } catch (error) {
      this.log.error(`Failed to upload file: ${error.message}`);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getImageStream(filename: string): Promise<Readable> {
    const filePath = join(this.uploadDirectory, filename);

    if (!existsAsync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Create and return a readable stream for the image file
    const imageStream = fs.createReadStream(filePath);

    return imageStream;
  }

  getImageUrl(filename: string): string {
    // Replace 'http://localhost:3000' with your actual server domain and port
    return `http://localhost:3000/uploads/${filename}`;
  }

  async deleteImage(filename: string): Promise<void> {
    const filePath = `${this.uploadDirectory}/${filename}`;
    console.log(filePath);
    if (await existsAsync(filePath)) {
      try {
        console.log('deleting file');
        await unlinkAsync(filePath);
      } catch (error) {
        // Handle file deletion error
        throw new Error(`Failed to delete file: ${error.message}`);
      }
    }
  }
}

const existsAsync = promisify(fs.exists);
const unlinkAsync = promisify(fs.unlink);
