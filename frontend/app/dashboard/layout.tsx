import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';
import { UserMenu } from '@/components/user-menu';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  // Token present but rejected by the backend: clear it and go to login
  if (!user) redirect('/api/auth/clear');

  return (
    <div className="min-h-screen">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <span className="text-lg font-semibold">Money Manager</span>
        <UserMenu user={user} />
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
