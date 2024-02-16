import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageQueryRepository } from '@classting/school-pages/persistence/repositories';
import { SchoolPageAdminController } from '@classting/school-pages/presentation/controllers';
import { SchoolPageController } from '@classting/school-pages/presentation/controllers/school-page.controller';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolPageEntity])],
  controllers: [SchoolPageAdminController, SchoolPageController],
  providers: [SchoolPageService, SchoolPageQueryRepository],
  exports: [SchoolPageService],
})
export class SchoolPageModule {}
