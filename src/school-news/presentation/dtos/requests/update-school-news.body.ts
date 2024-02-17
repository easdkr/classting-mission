import { UpdateSchoolNewsCommand } from '@classting/school-news/usecase/dtos/commands';
import { Exclude } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Length, MinLength } from 'class-validator';

export class UpdateSchoolNewsBody {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  public title?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  public content?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  public pageId?: number;

  @Exclude()
  public toCommand(): UpdateSchoolNewsCommand {
    return {
      title: this.title,
      content: this.content,
      pageId: this.pageId,
    };
  }
}
