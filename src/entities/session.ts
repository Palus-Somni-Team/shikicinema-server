import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { ISession } from 'connect-typeorm';

@Entity('sessions')
export class SessionEntity implements ISession {
  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @Index()
  @Column('bigint', { name: 'expired_at' })
  expiredAt: number;

  @Column('text')
  json: string;

  constructor(
      id: string,
      expiredAt: number,
      json: string,
  ) {
      this.id = id;
      this.expiredAt = expiredAt;
      this.json = json;
  }
}
