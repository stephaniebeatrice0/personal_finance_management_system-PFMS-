'use client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-medium uppercase text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
      >
        {user.name.charAt(0)}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="min-w-[200px] rounded-md border border-slate-200 bg-white p-1 shadow-md"
        >
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-200" />
          <DropdownMenu.Item
            onSelect={logout}
            className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-slate-100"
          >
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
