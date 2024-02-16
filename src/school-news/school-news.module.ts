import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { SchoolNewsService } from '@classting/school-news/usecase/services';
import { SchoolPageModule } from '@classting/school-pages';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [SchoolPageModule, TypeOrmModule.forFeature([SchoolNewsEntity])],
  controllers: [],
  providers: [SchoolNewsService],
})
export class SchoolNewsModule {}
