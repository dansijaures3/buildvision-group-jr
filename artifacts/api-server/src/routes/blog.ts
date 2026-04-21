import { Router, type IRouter } from "express";
import { db, blogPosts } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateBlogPostBody, UpdateBlogPostBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog", async (_req, res) => {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  res.json(rows);
});

router.get("/blog/:slug", async (req, res) => {
  const slug = req.params["slug"]!;
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.post("/blog", async (req, res) => {
  const body = CreateBlogPostBody.parse(req.body);
  const [row] = await db.insert(blogPosts).values(body).returning();
  return res.status(201).json(row);
});

router.put("/blog/:id/admin", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateBlogPostBody.parse(req.body);
  const [row] = await db.update(blogPosts).set(body).where(eq(blogPosts.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.delete("/blog/:id/admin", async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  res.status(204).send();
});

export default router;
