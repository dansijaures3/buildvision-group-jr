import { Router, type IRouter } from "express";
import { db, events } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateEventBody, UpdateEventBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/events", async (_req, res) => {
  const rows = await db.select().from(events).orderBy(desc(events.eventDate));
  res.json(rows);
});

router.post("/events", async (req, res) => {
  const body = CreateEventBody.parse(req.body);
  const [row] = await db.insert(events).values(body).returning();
  return res.status(201).json(row);
});

router.put("/events/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateEventBody.parse(req.body);
  const [row] = await db.update(events).set(body).where(eq(events.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.delete("/events/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(events).where(eq(events.id, id));
  res.status(204).send();
});

export default router;
