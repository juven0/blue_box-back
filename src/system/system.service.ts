import { Injectable } from '@nestjs/common';
import { userInfo, cpus, platform } from 'node:os';
import { systemInformation } from './interfaces/systemInformation';
import { getDiskInfo, getDiskInfoSync } from 'node-disk-info';
import { storage } from './interfaces/storage.inteface';
import fs from 'fs/promises';

@Injectable()
export class SystemService {
  systemInformation: systemInformation;
  driverList: storage[];

  async infoSystem(): Promise<systemInformation> {
    let stor = [];
    try {
      const stats = await getDiskInfo();
      for (const driver of stats) {
        if (driver.mounted.includes('/media') || driver.mounted == '/') {
          let systemStorage: storage;
          systemStorage = {
            totalSpace: driver.blocks,
            usedSpace: driver.used,
            freeSpace: driver.available,
            path: driver.mounted,
          };
          stor.push(systemStorage);
        }
      }
      this.systemInformation = {
        cpu: cpus()[0].model,
        platform: platform(),
        homedir: userInfo().homedir,
        userName: userInfo().username,
        storage: stor,
      };
    } catch (err) {}
    return this.systemInformation;
  }
}
