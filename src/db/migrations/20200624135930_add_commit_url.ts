import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("commit", (builder) => {
    builder.text("url").notNullable().defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("commit", (builder) => {
    builder.dropColumn("url");
  });
}
