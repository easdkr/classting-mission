import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { SchoolNewsQueryRepository } from '@classting/school-news/persistence/repositories';
import { SchoolNewsAdminController } from '@classting/school-news/presentation/controllers';
import { SchoolNewsService } from '@classting/school-news/usecase/services';
import { SchoolPageModule } from '@classting/school-pages';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [SchoolPageModule, TypeOrmModule.forFeature([SchoolNewsEntity])],
  controllers: [SchoolNewsAdminController],
  providers: [SchoolNewsService, SchoolNewsQueryRepository],
})
export class SchoolNewsModule {}
