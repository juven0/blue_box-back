import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';
import { systemInformation } from './interfaces/systemInformation';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}
  @Get()
  getSystemInfo(): Promise<systemInformation> {
    return this.systemService.infoSystem();
  }
}
