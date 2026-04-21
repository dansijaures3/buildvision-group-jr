import { Router, type IRouter } from "express";
import { db, commerceItems } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { CreateCommerceItemBody, UpdateCommerceItemBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/commerce-items", async (_req, res) => {
  const rows = await db.select().from(commerceItems).orderBy(asc(commerceItems.name));
  res.json(rows);
});

router.post("/commerce-items", async (req, res) => {
  const body = CreateCommerceItemBody.parse(req.body);
  const [row] = await db.insert(commerceItems).values(body).returning();
  return res.status(201).json(row);
});

router.put("/commerce-items/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateCommerceItemBody.parse(req.body);
  const [row] = await db.update(commerceItems).set(body).where(eq(commerceItems.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.delete("/commerce-items/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(commerceItems).where(eq(commerceItems.id, id));
  res.status(204).send();
});

export default router;
