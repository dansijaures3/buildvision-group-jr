import { Router, type IRouter } from "express";
import { db, services } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { CreateServiceBody, UpdateServiceBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/services", async (_req, res) => {
  const rows = await db.select().from(services).orderBy(asc(services.displayOrder));
  res.json(rows);
});

router.get("/services/:slug", async (req, res) => {
  const slug = req.params["slug"]!;
  const [row] = await db.select().from(services).where(eq(services.slug, slug));
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.post("/services", async (req, res) => {
  const body = CreateServiceBody.parse(req.body);
  const [row] = await db.insert(services).values(body).returning();
  return res.status(201).json(row);
});

router.put("/services/:id/admin", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateServiceBody.parse(req.body);
  const [row] = await db.update(services).set(body).where(eq(services.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.delete("/services/:id/admin", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(services).where(eq(services.id, id));
  res.status(204).send();
});

export default router;
