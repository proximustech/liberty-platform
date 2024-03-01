import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Author } from '../entities/index';

export class AuthorFactory extends Factory<Author> {
  model = Author;

  definition(): Partial<Author> {
    return {
      name: faker.person.fullName()
    };
  }
}