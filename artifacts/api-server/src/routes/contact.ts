import { Router, type IRouter } from "express";
import { db, contactMessages } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateContactMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(row: typeof contactMessages.$inferSelect) {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

router.get("/contact", async (_req, res) => {
  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  res.json(rows.map(serialize));
});

router.post("/contact", async (req, res) => {
  const body = CreateContactMessageBody.parse(req.body);
  const [row] = await db.insert(contactMessages).values(body).returning();
  res.status(201).json(serialize(row!));
});

router.delete("/contact/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  res.status(204).send();
});

export default router;
