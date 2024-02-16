import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageService } from '@classting/school-pages/usecase/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolPageEntity])],
  controllers: [],
  providers: [SchoolPageService],
})
export class SchoolPageModule {}
