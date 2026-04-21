import { Router, type IRouter } from "express";
import { db, projects } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { CreateProjectBody, UpdateProjectBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res) => {
  const category = req.query["category"] as string | undefined;
  const featured = req.query["featured"];
  const conds = [];
  if (category) conds.push(eq(projects.category, category));
  if (featured === "true") conds.push(eq(projects.featured, true));
  const rows = await db
    .select()
    .from(projects)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(projects.completedAt));
  res.json(rows);
});

router.get("/projects/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const [row] = await db.select().from(projects).where(eq(projects.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.post("/projects", async (req, res) => {
  const body = CreateProjectBody.parse(req.body);
  const [row] = await db.insert(projects).values(body).returning();
  return res.status(201).json(row);
});

router.put("/projects/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateProjectBody.parse(req.body);
  const [row] = await db.update(projects).set(body).where(eq(projects.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.delete("/projects/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(projects).where(eq(projects.id, id));
  res.status(204).send();
});

export default router;
