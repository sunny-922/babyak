import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { PotService } from './pot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/pots')
export class PotController {
  constructor(private potService: PotService) {}

  @Get()
  getPots(@Query('search') search = '', @Query('filter') filter = '') {
    return this.potService.getPots(search, filter);
  }

  @Get(':potId')
  getPotById(@Param('potId') potId: string) {
    return this.potService.getPotById(Number(potId));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPot(@Body() dto: any, @Request() req: any) {
    return this.potService.createPot(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':potId')
  updatePot(@Param('potId') potId: string, @Body() dto: any, @Request() req: any) {
    return this.potService.updatePot(Number(potId), dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':potId')
  deletePot(@Param('potId') potId: string, @Request() req: any) {
    return this.potService.deletePot(Number(potId), req.user.id);
  }
}