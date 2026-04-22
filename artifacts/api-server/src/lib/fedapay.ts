import { logger } from "./logger";

const FEDAPAY_API_BASE = process.env["FEDAPAY_API_BASE"] || "https://api.fedapay.com/v1";

export interface CreateTransactionInput {
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  customer: {
    firstname: string;
    lastname: string;
    email: string;
    phone_number?: { number: string; country: string };
  };
}

export interface FedaPayTransaction {
  id: number;
  reference: string;
  amount: number;
  status: string;
  description: string;
}

export async function createFedaPayTransaction(input: CreateTransactionInput): Promise<{ transaction: FedaPayTransaction; paymentUrl: string }> {
  const secretKey = process.env["FEDAPAY_SECRET_KEY"];
  if (!secretKey) throw new Error("FEDAPAY_SECRET_KEY is not configured");

  const txRes = await fetch(`${FEDAPAY_API_BASE}/transactions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!txRes.ok) {
    const text = await txRes.text();
    logger.error({ status: txRes.status, body: text }, "FedaPay create transaction failed");
    throw new Error(`FedaPay create transaction failed (${txRes.status}): ${text}`);
  }

  const txJson = await txRes.json() as { "v1/transaction": FedaPayTransaction };
  const transaction = txJson["v1/transaction"];

  const tokenRes = await fetch(`${FEDAPAY_API_BASE}/transactions/${transaction.id}/token`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    logger.error({ status: tokenRes.status, body: text }, "FedaPay generate token failed");
    throw new Error(`FedaPay generate token failed (${tokenRes.status}): ${text}`);
  }

  const tokenJson = await tokenRes.json() as { url: string; token: string };
  return { transaction, paymentUrl: tokenJson.url };
}

export async function fetchFedaPayTransaction(id: string | number): Promise<FedaPayTransaction> {
  const secretKey = process.env["FEDAPAY_SECRET_KEY"];
  if (!secretKey) throw new Error("FEDAPAY_SECRET_KEY is not configured");

  const res = await fetch(`${FEDAPAY_API_BASE}/transactions/${id}`, {
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Accept": "application/json",
    },
  });
  if (!res.ok) throw new Error(`FedaPay fetch transaction failed (${res.status})`);
  const json = await res.json() as { "v1/transaction": FedaPayTransaction };
  return json["v1/transaction"];
}
