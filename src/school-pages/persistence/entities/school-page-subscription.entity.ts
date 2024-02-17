import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';
import { UserEntity } from '@classting/users/persistence/entities';
import { BaseEntity } from '@libs/database/entities';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity('school_page_subscriptions')
@Unique('idx_user_id_page_id_on_school_page_subscriptions', ['userId', 'pageId'])
export class SchoolPageSubscriptionEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  public userId: number;

  @Column({ name: 'page_id' })
  public pageId: number;

  @Column({ name: 'cancelled_at', nullable: true, default: null, type: 'timestamp' })
  public cancelledAt: Date | null;

  @ManyToOne(() => SchoolPageEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  public page: SchoolPageEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  public static from(params: { userId: number; pageId: number }) {
    const entity = new SchoolPageSubscriptionEntity();
    entity.userId = params.userId;
    entity.pageId = params.pageId;

    return entity;
  }

  public cancel() {
    this.cancelledAt = new Date();
  }
}
