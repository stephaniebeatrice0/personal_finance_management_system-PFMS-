import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome back, {user.name}</h1>
      <p className="mt-1 text-slate-600">You are signed in.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {["Balance", "Income", "Expenses"].map((label) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
