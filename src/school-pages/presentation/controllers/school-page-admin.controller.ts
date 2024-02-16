import { Role } from '@classting/auth/usecase/enums';
import { CreateSchoolPageBody } from '@classting/school-pages/presentation/dtos/requests';
import { CreateSchoolPageResponse } from '@classting/school-pages/presentation/dtos/responses';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { UseRole } from '@libs/decorators/role.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('School Pages')
@UseRole(Role.ADMIN)
@Controller({ path: 'school-pages', version: '1' })
export class SchoolPageAdminController {
  public constructor(private readonly schoolPageService: SchoolPageService) {}

  @Post()
  public async createSchoolPage(@Body() body: CreateSchoolPageBody): Promise<CreateSchoolPageResponse> {
    const command = body.toCommand();

    return this.schoolPageService.create(command).then(CreateSchoolPageResponse.fromEntity);
  }
}
