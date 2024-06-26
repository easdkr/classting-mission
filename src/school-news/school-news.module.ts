import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { SchoolNewsQueryRepository } from '@classting/school-news/persistence/repositories';
import { SchoolNewsAdminController } from '@classting/school-news/presentation/controllers';
import { SchoolNewsController } from '@classting/school-news/presentation/controllers/school-news.controller';
import { SchoolNewsService } from '@classting/school-news/usecase/services';
import { SchoolPageModule } from '@classting/school-pages';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [forwardRef(() => SchoolPageModule), TypeOrmModule.forFeature([SchoolNewsEntity])],
  controllers: [SchoolNewsAdminController, SchoolNewsController],
  providers: [SchoolNewsService, SchoolNewsQueryRepository],
  exports: [SchoolNewsService],
})
export class SchoolNewsModule {}
