import "server-only";
import { API_URL } from "@/lib/config";
import { getAccessToken } from "@/lib/session";
import type { Transaction } from "@/lib/finance";

/* eslint-disable @typescript-eslint/no-explicit-any */
function nameOf(v: any): string | undefined {
  if (v == null) return undefined;
  return typeof v === "object" ? (v.name ?? v.title) : String(v);
}

function toTransaction(r: any): Transaction {
  const typeName = (
    nameOf(r.type) ??
    nameOf(r.transaction_type) ??
    ""
  ).toLowerCase();
  const raw = String(r.transaction_date ?? r.date ?? r.created_at);
  return {
    id: r.id,
    type: typeName.includes("income") ? "income" : "expense",
    amount: Number(r.amount),
    category:
      nameOf(r.category) ?? nameOf(r.transaction_category) ?? "Uncategorised",
    description: r.description ?? r.title ?? r.note ?? "",
    date: raw.includes(" ") && !raw.includes("T") ? raw.replace(" ", "T") : raw,
  };
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const token = await getAccessToken();
  const url = `${API_URL}/transactions?per_page=500`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
  } catch (cause) {
    console.error("[transactions] could not reach", url, cause);
    throw new Error(`Could not reach the API at ${url}`);
  }

  if (!res.ok) {
    console.error(
      `[transactions] ${res.status} from ${url}`,
      (await res.text()).slice(0, 500),
    );
    throw new Error(`Transactions request failed (${res.status})`);
  }

  const json = await res.json();
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return rows.map(toTransaction);
}
