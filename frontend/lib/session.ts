import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { User } from "./types";

export const requireUser = cache(async (): Promise<User> => {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (!session.accessToken) redirect("/api/session-expired");

  return {
    name: session.user.name ?? "User",
    email: session.user.email ?? "",
  };
});
