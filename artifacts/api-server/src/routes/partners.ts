import { Router, type IRouter } from "express";
import { db, partners } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { CreatePartnerBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/partners", async (_req, res) => {
  const rows = await db.select().from(partners).orderBy(asc(partners.name));
  res.json(rows);
});

router.post("/partners", async (req, res) => {
  const body = CreatePartnerBody.parse(req.body);
  const [row] = await db.insert(partners).values(body).returning();
  res.status(201).json(row);
});

router.delete("/partners/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(partners).where(eq(partners.id, id));
  res.status(204).send();
});

export default router;
