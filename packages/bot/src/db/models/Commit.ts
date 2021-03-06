import db from "../db";
import * as Knex from "knex";

const tableName = "commit";

export interface Commit {
  id: string;
  user_id: number;
  score: number;
  message: string;
  committed_at: string;
  repo_name: string;
  url: string;
}

export async function findCommit(
  id: string,
  client: Knex = db
): Promise<Commit | undefined> {
  return client(tableName).where("id", id).first();
}

export async function createCommit(
  commit: Commit,
  client: Knex = db
): Promise<Commit> {
  const commits = await client(tableName)
    .returning("*")
    .insert<Commit[]>([commit]);
  return commits[0];
}

export async function getCommitsAfterDate(afterDate: Date): Promise<Commit[]> {
  return db(tableName)
    .select("*")
    .where<Commit[]>("commit.committed_at", ">", afterDate.toISOString());
}

export async function getTopCommitsAfterDate(
  afterDate: Date,
  limitCount: number
): Promise<Commit[]> {
  return db
    .from<Commit>(tableName)
    .select("*")
    .where("commit.committed_at", ">", afterDate.toISOString())
    .orderBy("commit.score", "desc")
    .orderBy("commit.committed_at", "desc")
    .limit(limitCount);
}
