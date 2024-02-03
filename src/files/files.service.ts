import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { resolve, extname } from 'node:path';
import { myFile } from './intefaces/file.interface';
import path from 'path';

@Injectable()
export class FilesService {
  //homePath = '/home/eddy/Téléchargements';
  homePath = '/home/eddy';
  filesArray = [];
  fileLoader(type: string[], path?: string): Promise<myFile[]> {
    const result = this.loadDirectory(type, path);
    this.filesArray = [];
    return result;
  }
  async loadDirectory(
    typeFile: string[],
    curentPath?: string,
  ): Promise<myFile[]> {
    let listFiles: any;
    try {
      listFiles = await fs.readdir(curentPath, { withFileTypes: true });
    } catch (error) {}
    for await (const item of listFiles) {
      if (item.isDirectory()) {
        const filePath = resolve(curentPath, item.name);
        await this.loadDirectory(typeFile, filePath);
      } else {
        if (typeFile.includes(extname(item.name).replace('.', ''))) {
          const filePath = resolve(curentPath, item.name);
          const file: myFile = {
            name: item.name.replace(extname(item.name), ''),
            extension: extname(item.name).replace('.', ''),
            pathe: filePath,
          };
          this.filesArray.push(file);
        }
      }
    }
    return this.filesArray;
  }

  async loadOneDirectory(directory: string) {
    const listFiles = [];
    let files: any;
    try {
      files = await fs.opendir(directory);
    } catch {}
    for await (const item of files) {
      let file: myFile;
      if (item.isDirectory()) {
        file = {
          name: item.name,
          type: 'directory',
          pathe: directory + '/' + item.name,
        };
        listFiles.push(file);
      } else {
        file = {
          name: item.name.replace(extname(item.name), ''),
          type: 'folder',
          extension: extname(item.name).replace('.', ''),
          pathe: directory + '/' + item.name,
        };
        listFiles.push(file);
      }
    }
    return listFiles;
  }

  searchFiles(name: string, path: string): Promise<myFile[]> {
    const result = this.loadSearchFiles(path, name);
    this.filesArray = [];
    return result;
  }

  async loadSearchFiles(
    curentPath: string,
    nameSearch: string,
  ): Promise<myFile[]> {
    const listFiles = await fs.readdir(curentPath, { withFileTypes: true });
    for await (const item of listFiles) {
      if (item.name.includes(nameSearch)) {
        const filePath = resolve(curentPath, item.name);
        let file: myFile;
        if (item.isDirectory()) {
          file = {
            name: item.name,
            type: 'directory',
            pathe: filePath,
          };
          this.filesArray.push(file);
        } else {
          file = {
            name: item.name.replace(extname(item.name), ''),
            type: 'folder',
            extension: extname(item.name).replace('.', ''),
            pathe: filePath,
          };
          this.filesArray.push(file);
        }
      }
    }
    return this.filesArray;
  }
}
