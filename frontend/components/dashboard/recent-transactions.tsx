import { Badge, Table, Text } from "@radix-ui/themes";
import { money, shortDate, type Transaction } from "@/lib/finance";

export function RecentTransactions({ rows }: { rows: Transaction[] }) {
  if (rows.length === 0) {
    return (
      <p className="border-t border-[var(--gray-a6)] py-10 italic text-[var(--gray-11)]">
        No records yet. Income and spending you add will appear here.
      </p>
    );
  }

  return (
    <Table.Root variant="ghost" size="3">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="hidden sm:table-cell">Category</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell justify="end">Amount</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((t) => (
          <Table.Row key={t.id} align="center">
            <Table.RowHeaderCell className="whitespace-nowrap">{shortDate(t.date)}</Table.RowHeaderCell>
            <Table.Cell>{t.description || t.category}</Table.Cell>
            <Table.Cell className="hidden sm:table-cell">
              <Badge variant="soft" color="gray" radius="full">
                {t.category}
              </Badge>
            </Table.Cell>
            <Table.Cell justify="end" className="whitespace-nowrap">
              <Text weight="bold" color={t.type === "income" ? "green" : "red"} className="tabular-nums">
                {t.type === "income" ? "+" : "\u2212"}
                {money(t.amount)}
              </Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
