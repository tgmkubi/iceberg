import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  getHealth() {
    const health = this.appService.getHealth();
    return { message: "ok", data: health };
  }
}
