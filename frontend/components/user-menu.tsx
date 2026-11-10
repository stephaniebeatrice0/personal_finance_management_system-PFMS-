"use client";

import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";
import type { User } from "@/lib/types";
import { logoutAction } from "@/app/action/auth";

export function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          variant="solid"
          radius="full"
          size="2"
          aria-label="Account menu"
          className="font-bold uppercase"
        >
          {user.name.charAt(0)}
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="end"
        sideOffset={8}
        className="min-w-[200px]"
      >
        <div className="px-3 py-2">
          <Text as="p" weight="bold">
            {user.name}
          </Text>
          <Text as="p" size="2" color="gray">
            {user.email}
          </Text>
        </div>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          color="red"
          onSelect={() => {
            void logoutAction();
          }}
        >
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
