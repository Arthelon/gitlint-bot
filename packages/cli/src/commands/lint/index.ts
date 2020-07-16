import fs from "fs";
import path from "path";
import getStdin from "get-stdin";
import readCommits from "@commitlint/read";
import { LintCommandFlags } from "../../types";
import { lintCommitMessage } from "@oursky/gitlint";
import { discoverConfig, applyPresets } from "@oursky/gitlint/lib/config";
import { RulesPreset } from "@oursky/gitlint/lib/config/schema";
import { formatResults } from "./format";

const createConfigLoader = (configFile: string | undefined) => async (
  _: string
): Promise<string | null> => {
  if (typeof configFile === "undefined") return null;
  const filePath = path.resolve(".", configFile);
  if (!fs.existsSync(filePath)) return null;
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) return null;
  return fs.readFileSync(filePath, "utf-8");
};

async function loadPreset(
  configFile: string | undefined
): Promise<RulesPreset> {
  const loader = createConfigLoader(configFile);
  const config = await discoverConfig(loader);
  if (config === null && typeof configFile !== "undefined") {
    throw new Error(`Config file not found: ${configFile}`);
  }
  return applyPresets(config);
}

async function loadCommitMessages(flags: LintCommandFlags): Promise<string[]> {
  if (typeof flags.stdIn !== "undefined" && !!flags.stdIn) {
    const message = await getStdin();
    if (message.length === 0) return [];
    return [message];
  } else if (
    typeof flags.from !== "undefined" ||
    typeof flags.to !== "undefined"
  ) {
    return readCommits({
      from: flags.from,
      to: flags.to,
    });
  }
  // Reads last commit from .git/COMMIT_EDITMSG
  return readCommits({ edit: true });
}

async function lintCommand(flags: LintCommandFlags): Promise<void> {
  const preset = await loadPreset(flags.config);
  const messages = await loadCommitMessages(flags);
  if (messages.length === 0) {
    console.log("No commit messages found!");
    process.exit(0);
  }
  const results = await Promise.all(
    messages.map(async (message) => {
      const result = await lintCommitMessage(message, preset);
      return {
        ...result,
        commitMessage: message,
      };
    })
  );
  const formattedResults = formatResults(results);
  if (formattedResults !== "") {
    console.log(formattedResults);
    process.exit(1);
  }
}

export default lintCommand;