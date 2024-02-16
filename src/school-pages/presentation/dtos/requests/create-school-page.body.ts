import { City } from '@classting/school-pages/usecase/enums';
import { Exclude } from 'class-transformer';
import { IsEnum, IsString, Length } from 'class-validator';

export class CreateSchoolPageBody {
  @IsString()
  @Length(1, 255)
  public name: string;

  @IsEnum(City)
  public city: City;

  @Exclude()
  public toCommand() {
    return {
      name: this.name,
      city: this.city,
    };
  }
}
