export { Commit } from "@commitlint/types";
import { Commit } from "@commitlint/types";
import parse from "@commitlint/parse";

const blankCommit = {
  raw: "",
  header: "",
  type: null,
  scope: null,
  subject: null,
  body: null,
  footer: null,
  mentions: [],
  notes: [],
  references: [],
  revert: null,
  merge: null,
};

export async function parseCommit(commitMessage: string): Promise<Commit> {
  // @commitlint/parse parser throws error if commit message is empty
  return commitMessage.trim().length !== 0 ? parse(commitMessage) : blankCommit;
}
