import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminGuard } from '../common/admin.guard';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.usersService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      role,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateUserRoleDto) {
    return this.usersService.updateRole(id, updateRoleDto);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // Prevent users from deleting themselves
    const userId = req.user?.userId || req.user?.sub;
    if (userId === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    return this.usersService.remove(id);
  }
}

