import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Author,Book } from "../plugins/mikroorm/entities/index";

import { AuthorFactory } from '../plugins/mikroorm/factories/author_factory'
import { BookFactory } from '../plugins/mikroorm/factories/book_factory'

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {

    //Without factory
    const author = em.create(Author,{
      name: "Pedro",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const book = em.create(Book,{
      name:"Pedro",
      author: author,
      createdAt: new Date(),
      updatedAt: new Date()      
    
    })

    //With factory
    const books: Book[] = new BookFactory(em).each(book => {
      book.author = new AuthorFactory(em).makeOne();
    }).make(5);    

  }
}
