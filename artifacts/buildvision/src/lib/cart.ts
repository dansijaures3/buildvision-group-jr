import { useEffect, useState } from "react";

export interface CartLine {
  id: number;
  name: string;
  image: string;
  priceAmount: number;
  currency: string;
  quantity: number;
}

const STORAGE_KEY = "bv_cart_v1";

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("bv-cart-updated"));
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>(() => read());

  useEffect(() => {
    const sync = () => setLines(read());
    window.addEventListener("bv-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bv-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = (line: Omit<CartLine, "quantity">, qty = 1) => {
    const cur = read();
    const existing = cur.find((l) => l.id === line.id);
    if (existing) existing.quantity += qty;
    else cur.push({ ...line, quantity: qty });
    write(cur);
  };

  const setQty = (id: number, qty: number) => {
    const cur = read().map((l) => (l.id === id ? { ...l, quantity: Math.max(1, qty) } : l));
    write(cur);
  };

  const remove = (id: number) => write(read().filter((l) => l.id !== id));
  const clear = () => write([]);

  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotal = lines.reduce((s, l) => s + l.priceAmount * l.quantity, 0);
  const currency = lines[0]?.currency || "XOF";

  return { lines, add, setQty, remove, clear, itemCount, subtotal, currency };
}

export function formatXof(amount: number, currency = "XOF") {
  return new Intl.NumberFormat("fr-FR").format(amount) + " " + currency;
}
