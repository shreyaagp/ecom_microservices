import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/common';

import { AddressDto, UpdateProfileDto } from './dto/users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersController {
  /** Get the currently authenticated user's profile. */
  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  me(): Record<string, unknown> {
    return { route: 'users-me' };
  }

  /** Update the current user's profile fields. */
  @Patch()
  @ApiOperation({ summary: 'Update current user profile' })
  update(@Body() dto: UpdateProfileDto): Record<string, unknown> {
    return { route: 'users-update', firstName: dto.firstName };
  }

  /** List all saved shipping addresses for the current user. */
  @Get('addresses')
  @ApiOperation({ summary: 'List saved addresses' })
  addresses(): Record<string, unknown> {
    return { route: 'addresses-list' };
  }

  /** Create a new saved shipping address. */
  @Post('addresses')
  @ApiOperation({ summary: 'Create new address' })
  addAddress(@Body() dto: AddressDto): Record<string, unknown> {
    return { route: 'addresses-create', city: dto.city };
  }

  /** Update an existing saved address by ID. */
  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Update address' })
  updateAddress(@Param('id') id: string, @Body() dto: AddressDto): Record<string, unknown> {
    return { route: 'addresses-update', id, city: dto.city };
  }

  /** Delete a saved address by ID. */
  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete address' })
  removeAddress(@Param('id') id: string): Record<string, unknown> {
    return { route: 'addresses-delete', id };
  }
}
