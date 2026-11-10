import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { API_URL } from "@/lib/config";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const session = await auth();
  if (!session?.accessToken) redirect("/api/session-expired");

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (res.status === 401) redirect("/api/session-expired");
  return res;
}
