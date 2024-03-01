import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Book } from '../entities/index';

export class BookFactory extends Factory<Book> {
  model = Book;

  definition(): Partial<Book> {
    return {
      name: faker.word.adjective()
    };
  }
}