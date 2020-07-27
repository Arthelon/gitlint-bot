import { Router, Request } from "express";
import {
  getRepositorySummary,
  getViolatedCommits,
  getPageCount,
} from "./controllers";

const router = Router();

router.get("/", async (req: Request, res) => {
  const repoSummary = await getRepositorySummary();
  const pageNumber =
    typeof req.query.offset !== "undefined" ? Number(req.query.page) : 0;
  const commits = await getViolatedCommits(pageNumber);
  const pageCount = await getPageCount();
  res.render("dashboard", {
    title: "Dashboard",
    repositories: repoSummary,
    commits,
    pageCount,
  });
});

export default router;
