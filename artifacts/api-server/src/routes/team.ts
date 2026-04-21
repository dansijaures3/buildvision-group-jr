import { Router, type IRouter } from "express";
import { db, teamMembers } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { CreateTeamMemberBody, UpdateTeamMemberBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/team", async (_req, res) => {
  const rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder));
  res.json(rows);
});

router.post("/team", async (req, res) => {
  const body = CreateTeamMemberBody.parse(req.body);
  const [row] = await db.insert(teamMembers).values(body).returning();
  return res.status(201).json(row);
});

router.put("/team/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateTeamMemberBody.parse(req.body);
  const [row] = await db.update(teamMembers).set(body).where(eq(teamMembers.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.delete("/team/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  res.status(204).send();
});

export default router;
