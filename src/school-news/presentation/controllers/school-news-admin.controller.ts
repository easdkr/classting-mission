import { AuthGuard, RoleGuard } from '@classting/auth/presentation/guards';
import { Role } from '@classting/auth/usecase/enums';
import { CreateSchoolNewsBody } from '@classting/school-news/presentation/dtos/requests';
import { CreateSchoolNewsResponse } from '@classting/school-news/presentation/dtos/responses';
import { SchoolNewsService } from '@classting/school-news/usecase/services';
import { UseRole } from '@libs/decorators/role.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('School News Admin')
@UseRole(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
@Controller({ path: 'school-news', version: '1' })
export class SchoolNewsAdminController {
  public constructor(private readonly schoolNewsService: SchoolNewsService) {}

  @Post()
  public async create(@Body() body: CreateSchoolNewsBody): Promise<CreateSchoolNewsResponse> {
    const command = body.toCommand();
    const schoolNews = await this.schoolNewsService.create(command);

    return CreateSchoolNewsResponse.fromEntity(schoolNews);
  }
}
