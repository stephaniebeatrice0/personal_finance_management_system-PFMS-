"use client";

import { Button, Callout } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Callout.Root color="red" role="alert">
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text>
        Your records could not be loaded. Check that the API is running, then try again.{" "}
        <Button size="1" variant="soft" color="red" onClick={reset} className="ml-2">
          Try again
        </Button>
      </Callout.Text>
    </Callout.Root>
  );
}
