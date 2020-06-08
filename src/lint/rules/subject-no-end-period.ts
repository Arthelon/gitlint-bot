import { RuleCheckResults } from "./";
import { Commit } from "@commitlint/parse";

export default {
  name: "subject-no-end-period",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const valid = !commit.header.endsWith(".");
    return valid ? null : {};
  },
};