import { Entity, ManyToOne, Property } from '@mikro-orm/sqlite';
import { Author } from './index';
import { BaseEntity } from './base_entity';

@Entity()
export class Book extends BaseEntity {

  @Property()
  name: string;

  @ManyToOne(() => Author)
  author: Author;  

  constructor(name: string, author: Author) {
    super();
    this.name = name;
    this.author = author;
  }

}