import { Router, type IRouter } from "express";
import { db, commerceItems, orders } from "@workspace/db";
import { desc, eq, inArray } from "drizzle-orm";
import { CreateCheckoutBody, UpdateOrderStatusBody } from "@workspace/api-zod";
import { createFedaPayTransaction, fetchFedaPayTransaction } from "../lib/fedapay";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function makeRef() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BV-${t}-${r}`;
}

router.get("/orders", async (_req, res) => {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  res.json(rows);
});

router.get("/orders/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const [row] = await db.select().from(orders).where(eq(orders.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });

  if (row.paymentTransactionId && row.status === "pending") {
    try {
      const tx = await fetchFedaPayTransaction(row.paymentTransactionId);
      if (tx.status === "approved" || tx.status === "transferred") {
        const [updated] = await db
          .update(orders)
          .set({ status: "paid", paidAt: new Date() })
          .where(eq(orders.id, id))
          .returning();
        return res.json(updated);
      }
      if (tx.status === "canceled" || tx.status === "declined") {
        const [updated] = await db.update(orders).set({ status: "failed" }).where(eq(orders.id, id)).returning();
        return res.json(updated);
      }
    } catch (err) {
      logger.warn({ err }, "Could not refresh order status from FedaPay");
    }
  }
  return res.json(row);
});

router.patch("/orders/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const body = UpdateOrderStatusBody.parse(req.body);
  const [row] = await db.update(orders).set({ status: body.status }).where(eq(orders.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(row);
});

router.post("/checkout", async (req, res) => {
  const body = CreateCheckoutBody.parse(req.body);
  if (!body.items.length) return res.status(400).json({ error: "Empty cart" });

  const ids = body.items.map((i) => i.id);
  const dbItems = await db.select().from(commerceItems).where(inArray(commerceItems.id, ids));
  if (dbItems.length !== ids.length) return res.status(400).json({ error: "Invalid items" });

  const itemsResolved = body.items.map((i) => {
    const product = dbItems.find((d) => d.id === i.id)!;
    return { id: product.id, name: product.name, price: product.priceAmount, quantity: i.quantity };
  });

  const subtotal = itemsResolved.reduce((s, i) => s + i.price * i.quantity, 0);
  if (subtotal <= 0) return res.status(400).json({ error: "Total must be greater than zero" });

  const currency = dbItems[0]?.currency || "XOF";
  const reference = makeRef();

  const [order] = await db.insert(orders).values({
    reference,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    customerAddress: body.customerAddress ?? null,
    notes: body.notes ?? null,
    items: itemsResolved,
    subtotal,
    total: subtotal,
    currency,
    status: "pending",
    paymentProvider: "fedapay",
  }).returning();

  const origin = (req.headers["origin"] as string) || `${req.protocol}://${req.headers["host"]}`;
  const callbackUrl = `${origin}/commerce/merci?orderId=${order.id}`;

  const [firstname, ...rest] = body.customerName.trim().split(" ");
  const lastname = rest.join(" ") || firstname;

  try {
    const { transaction, paymentUrl } = await createFedaPayTransaction({
      amount: subtotal,
      currency,
      description: `Commande ${reference} - BuildVision`,
      callback_url: callbackUrl,
      customer: {
        firstname: firstname || "Client",
        lastname,
        email: body.customerEmail,
        phone_number: { number: body.customerPhone, country: "ci" },
      },
    });

    const [updated] = await db
      .update(orders)
      .set({ paymentTransactionId: String(transaction.id), paymentUrl })
      .where(eq(orders.id, order.id))
      .returning();

    return res.status(201).json({ order: updated, paymentUrl });
  } catch (err) {
    logger.error({ err }, "Checkout failed at FedaPay step");
    await db.update(orders).set({ status: "failed" }).where(eq(orders.id, order.id));
    return res.status(502).json({ error: "Payment provider error", details: (err as Error).message });
  }
});

export default router;
