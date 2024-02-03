import { storage } from './storage.inteface';

export interface systemInformation {
  cpu: string;
  platform: string;
  homedir: string;
  userName: string;
  storage: storage[];
}
