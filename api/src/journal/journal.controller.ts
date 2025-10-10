import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JournalService } from './journal.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private journalService: JournalService) {}

  @Get()
  list(@Request() req) {
    return this.journalService.list(req.user.userId);
  }

  @Post()
  create(@Request() req, @Body() createEntryDto: CreateEntryDto) {
    return this.journalService.create(req.user.userId, createEntryDto);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateEntryDto: UpdateEntryDto) {
    return this.journalService.update(id, req.user.userId, updateEntryDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.journalService.remove(id, req.user.userId);
  }
}
