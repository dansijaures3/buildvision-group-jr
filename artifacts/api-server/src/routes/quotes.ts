import { Router, type IRouter } from "express";
import { db, quoteRequests } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateQuoteRequestBody, UpdateQuoteStatusBody } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(row: typeof quoteRequests.$inferSelect) {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

router.get("/quotes", async (_req, res) => {
  const rows = await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
  res.json(rows.map(serialize));
});

router.post("/quotes", async (req, res) => {
  const body = CreateQuoteRequestBody.parse(req.body);
  const [row] = await db.insert(quoteRequests).values(body).returning();
  return res.status(201).json(serialize(row!));
});

router.patch("/quotes/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateQuoteStatusBody.parse(req.body);
  const [row] = await db
    .update(quoteRequests)
    .set({ status: body.status })
    .where(eq(quoteRequests.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(serialize(row));
});

router.delete("/quotes/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(quoteRequests).where(eq(quoteRequests.id, id));
  res.status(204).send();
});

export default router;
