import { Router, type IRouter } from "express";
import { db, testimonials } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateTestimonialBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res) => {
  const rows = await db.select().from(testimonials).orderBy(desc(testimonials.id));
  res.json(rows);
});

router.post("/testimonials", async (req, res) => {
  const body = CreateTestimonialBody.parse(req.body);
  const [row] = await db.insert(testimonials).values(body).returning();
  res.status(201).json(row);
});

router.delete("/testimonials/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(testimonials).where(eq(testimonials.id, id));
  res.status(204).send();
});

export default router;
