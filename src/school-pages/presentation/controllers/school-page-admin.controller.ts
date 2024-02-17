import { AuthGuard, RoleGuard } from '@classting/auth/presentation/guards';
import { Role } from '@classting/auth/usecase/enums';
import { CreateSchoolPageBody } from '@classting/school-pages/presentation/dtos/requests';
import { CreateSchoolPageResponse } from '@classting/school-pages/presentation/dtos/responses';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { UseRole } from '@libs/decorators/role.decorator';
import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('School Pages')
@UseRole(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
@Controller({ path: 'school-pages', version: '1' })
export class SchoolPageAdminController {
  public constructor(private readonly schoolPageService: SchoolPageService) {}

  @Post()
  @ApiConflictResponse({ description: 'School page already exists' })
  public async create(@Body() body: CreateSchoolPageBody): Promise<CreateSchoolPageResponse> {
    const command = body.toCommand();

    return this.schoolPageService.create(command).then(CreateSchoolPageResponse.fromEntity);
  }

  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.schoolPageService.delete(id);
  }
}
