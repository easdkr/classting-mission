import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';
import { BaseEntity } from '@libs/database/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

interface ISchoolNews {
  title: string;
  content: string;
  pageId: number;
}

@Entity('school_news')
export class SchoolNewsEntity extends BaseEntity {
  @Column()
  public title: string;

  @Column({ type: 'text' })
  public content: string;

  @Column({ name: 'page_id' })
  public pageId: number;

  @ManyToOne(() => SchoolPageEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  public page: SchoolPageEntity;

  public static from(params: ISchoolNews) {
    const entity = new SchoolNewsEntity();
    entity.title = params.title;
    entity.content = params.content;
    entity.pageId = params.pageId;

    return entity;
  }
}
