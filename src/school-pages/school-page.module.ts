import { SchoolNewsModule } from '@classting/school-news';
import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';
import {
  SchoolPageQueryRepository,
  SchoolPageSubscriptionQueryRepository,
} from '@classting/school-pages/persistence/repositories';
import { SchoolPageAdminController } from '@classting/school-pages/presentation/controllers';
import { SchoolPageController } from '@classting/school-pages/presentation/controllers/school-page.controller';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [forwardRef(() => SchoolNewsModule), TypeOrmModule.forFeature([SchoolPageEntity])],
  controllers: [SchoolPageAdminController, SchoolPageController],
  providers: [SchoolPageService, SchoolPageQueryRepository, SchoolPageSubscriptionQueryRepository],
  exports: [SchoolPageService],
})
export class SchoolPageModule {}
