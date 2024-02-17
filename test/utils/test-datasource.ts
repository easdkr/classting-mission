import { DataType, IMemoryDb, newDb } from 'pg-mem';
import { randomUUID } from 'crypto';
import { join as pathJoin } from 'path';

export async function createTestDataSource(db: IMemoryDb) {
  const dataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [`${pathJoin(__dirname, '../../src')}/**/*.entity{.ts,.js}`],
    database: 'test',
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  });

  return dataSource;
}

export function createDatabase() {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  // 별칭을 사용할 때 오류를 해결하기 위한 쿼리 인터셉터 https://github.com/oguimbal/pg-mem/issues/81
  const incriminatedQuery = `SELECT columns.*,
          pg_catalog.col_description(('"' || table_catalog || '"."' || table_schema || '"."' || table_name || '"')::regclass::oid, ordinal_position) AS description,
          ('"' || "udt_schema" || '"."' || "udt_name" || '"')::"regtype" AS "regtype",
          pg_catalog.format_type("col_attr"."atttypid", "col_attr"."atttypmod") AS "format_type"
          FROM "information_schema"."columns"
          LEFT JOIN "pg_catalog"."pg_attribute" AS "col_attr"
          ON "col_attr"."attname" = "columns"."column_name"
          AND "col_attr"."attrelid" = (
            SELECT
              "cls"."oid" FROM "pg_catalog"."pg_class" AS "cls"
              LEFT JOIN "pg_catalog"."pg_namespace" AS "ns"
              ON "ns"."oid" = "cls"."relnamespace"
            WHERE "cls"."relname" = "columns"."table_name"
            AND "ns"."nspname" = "columns"."table_schema"
            )`;

  db.public.interceptQueries((text) => {
    if (text.replace(/[\n ]/g, '').startsWith(incriminatedQuery.replace(/[\n ]/g, ''))) {
      return [];
    }
    return null;
  });

  // TypeOrm에서 Postgresql를 사용할 때 필요한 함수들 더미 선언 https://github.com/oguimbal/pg-mem/issues/282
  db.public.registerFunction({
    name: 'current_database',
    args: [],
    returns: DataType.text,
    implementation: () => `test`,
  });

  db.public.registerFunction({
    name: 'version',
    args: [],
    returns: DataType.text,
    implementation: () => `test`,
  });

  db.public.registerFunction({
    name: 'obj_description',
    args: [DataType.regclass, DataType.text],
    returns: DataType.text,
    implementation: () => `test`,
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: randomUUID,
      impure: true,
    });
  });

  return db;
}
