import { defineConfig } from '@mikro-orm/sqlite';
import { SeedManager } from '@mikro-orm/seeder';
//import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export default defineConfig({
    entities: ['./src/**/entities/*.ts'], // path to your JS entities (dist), relative to `baseDir`
    entitiesTs: ['./src/**/entities/*.ts'], // path to your TS entities (source), relative to `baseDir`
    dbName: 'webapptest.db.sqlite',
    extensions: [SeedManager],
    //highlighter: new SqlHighlighter(),
    //debug: true,
});