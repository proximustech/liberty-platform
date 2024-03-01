import { Entity, Property } from '@mikro-orm/sqlite';
import { BaseEntity } from './base_entity';

@Entity()
export class Author extends BaseEntity {

  @Property()
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

}