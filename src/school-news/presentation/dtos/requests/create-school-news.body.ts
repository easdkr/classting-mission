import { CreateSchoolNewsCommand } from '@classting/school-news/usecase/dtos/commands';
import { Exclude } from 'class-transformer';
import { IsInt, IsPositive, IsString, Length, MinLength } from 'class-validator';

export class CreateSchoolNewsBody {
  @IsString()
  @Length(1, 100)
  public title: string;

  @IsString()
  @MinLength(1)
  public content: string;

  @IsInt()
  @IsPositive()
  public pageId: number;

  @Exclude()
  public toCommand(): CreateSchoolNewsCommand {
    return {
      title: this.title,
      content: this.content,
      pageId: this.pageId,
    };
  }
}
