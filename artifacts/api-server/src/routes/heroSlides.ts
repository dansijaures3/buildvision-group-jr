import { Router, type IRouter } from "express";
import { db, heroSlides } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { CreateHeroSlideBody, UpdateHeroSlideBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/hero-slides", async (req, res) => {
  const activeOnly = req.query["activeOnly"] === "true";
  const rows = await db
    .select()
    .from(heroSlides)
    .orderBy(asc(heroSlides.displayOrder));
  res.json(activeOnly ? rows.filter((r) => r.isActive) : rows);
});

router.post("/hero-slides", async (req, res) => {
  const body = CreateHeroSlideBody.parse(req.body);
  const [row] = await db.insert(heroSlides).values(body).returning();
  return res.status(201).json(row);
});

router.put("/hero-slides/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateHeroSlideBody.parse(req.body);
  const [row] = await db
    .update(heroSlides)
    .set(body)
    .where(eq(heroSlides.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.delete("/hero-slides/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  res.status(204).send();
});

export default router;
