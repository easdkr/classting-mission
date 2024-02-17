import { CreateSchoolNewsCommand } from '@classting/school-news/usecase/dtos/commands/create-school-news.command';

export interface UpdateSchoolNewsCommand extends Partial<CreateSchoolNewsCommand> {}
