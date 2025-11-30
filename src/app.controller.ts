import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('customers')
  getCustomers() {
    return this.appService.getCustomers();
  }

  @Post('customers/:id/reveal')
  revealNationalId(@Param('id') id: number) {
    return this.appService.getNationalId(Number(id));
  }
}
