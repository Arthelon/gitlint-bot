import * as Knex from "knex";

const tableName = "commit_error";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (builder: Knex.TableBuilder) => {
    builder.increments("id").primary();
    builder.integer("commitId").unsigned().notNullable();
    builder.string("rule").notNullable();
    builder.text("message").notNullable();
    builder.foreign("commitId").references("id").inTable("commit");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
