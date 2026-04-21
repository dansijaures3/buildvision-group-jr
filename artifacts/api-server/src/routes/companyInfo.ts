import { Router, type IRouter } from "express";
import { db, companyInfo } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateCompanyInfoBody } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(row: typeof companyInfo.$inferSelect) {
  return { ...row, updatedAt: row.updatedAt.toISOString() };
}

async function getOrCreate() {
  const rows = await db.select().from(companyInfo).limit(1);
  if (rows[0]) return rows[0];
  const [row] = await db.insert(companyInfo).values({}).returning();
  return row!;
}

router.get("/company-info", async (_req, res) => {
  const row = await getOrCreate();
  return res.json(serialize(row));
});

router.put("/company-info", async (req, res) => {
  const body = UpdateCompanyInfoBody.parse(req.body);
  const existing = await getOrCreate();
  const [row] = await db
    .update(companyInfo)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(companyInfo.id, existing.id))
    .returning();
  return res.json(serialize(row!));
});

export default router;
