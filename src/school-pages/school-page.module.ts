import { SchoolNewsModule } from '@classting/school-news';
import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';
import {
  SchoolPageQueryRepository,
  SchoolPageSubscriptionQueryRepository,
} from '@classting/school-pages/persistence/repositories';
import { SchoolPageAdminController } from '@classting/school-pages/presentation/controllers';
import { SchoolPageController } from '@classting/school-pages/presentation/controllers/school-page.controller';
import { SchoolPageService, SchoolPageSubscriptionService } from '@classting/school-pages/usecase/services';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => SchoolNewsModule),
    TypeOrmModule.forFeature([SchoolPageEntity, SchoolPageSubscriptionEntity]),
  ],
  controllers: [SchoolPageAdminController, SchoolPageController],
  providers: [
    SchoolPageService,
    SchoolPageSubscriptionQueryRepository,
    SchoolPageSubscriptionService,
    SchoolPageQueryRepository,
  ],
  exports: [SchoolPageService],
})
export class SchoolPageModule {}
