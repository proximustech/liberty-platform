import { PrimaryKey, Property } from '@mikro-orm/sqlite';
//import { types } from '@mikro-orm/core';

export abstract class BaseEntity {

  @PrimaryKey()
  id!: number;

  //@Property({ type: types.date, nullable: true })
  @Property({ nullable: true })
  createdAt = new Date();

  //@Property({ type: types.date, onUpdate: () => new Date() })
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

}