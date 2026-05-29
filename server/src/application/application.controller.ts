import { Controller, Get, Post, Patch, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('pots/:potId/applications')
  @UseGuards(JwtAuthGuard)
  applyToPot(@Param('potId') potId: string, @Body('message') message: string, @Request() req: any) {
    return this.applicationService.applyToPot(Number(potId), req.user.id, message ?? '');
  }

  @Get('pots/:potId/applications')
  getApplications(@Param('potId') potId: string) {
    return this.applicationService.getApplications(Number(potId));
  }

  @Get('users/me/applications')
  @UseGuards(JwtAuthGuard)
  getMyApplications(@Request() req: any) {
    return this.applicationService.getMyApplications(req.user.id);
  }

  @Patch('applications/:id/approve')
  @UseGuards(JwtAuthGuard)
  approveApplication(@Param('id') id: string, @Request() req: any) {
    return this.applicationService.updateStatus(Number(id), 'approved', req.user.id);
  }

  @Patch('applications/:id/reject')
  @UseGuards(JwtAuthGuard)
  rejectApplication(@Param('id') id: string, @Request() req: any) {
    return this.applicationService.updateStatus(Number(id), 'rejected', req.user.id);
  }
}
