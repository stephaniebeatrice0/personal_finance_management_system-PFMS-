"use server";

import { auth, signOut } from "@/auth";
import { API_URL } from "@/lib/config";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const session = await auth();
  const token = session?.accessToken;

  if (token) {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }).catch(() => undefined);
  }

  await signOut({ redirect: false });
  redirect("/login");
}