import { AuthGuard, RoleGuard } from '@classting/auth/presentation/guards';
import { Role } from '@classting/auth/usecase/enums';
import { CreateSchoolNewsBody, UpdateSchoolNewsBody } from '@classting/school-news/presentation/dtos/requests';
import { CreateSchoolNewsResponse } from '@classting/school-news/presentation/dtos/responses';
import { UpdateSchoolNewsResponse } from '@classting/school-news/presentation/dtos/responses/update-school-news.response';
import { SchoolNewsService } from '@classting/school-news/usecase/services';
import { UseRole } from '@libs/decorators/role.decorator';
import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
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

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSchoolNewsBody,
  ): Promise<UpdateSchoolNewsResponse> {
    const command = body.toCommand();
    const schoolNews = await this.schoolNewsService.update(id, command);

    return UpdateSchoolNewsResponse.fromEntity(schoolNews);
  }
}
