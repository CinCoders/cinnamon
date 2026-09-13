import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const projects = [
  { budget: "$12,500", project: "Website Redesign", status: "Paid", team: "Frontend Team" },
  { budget: "$8,750", project: "Mobile App", status: "Unpaid", team: "Mobile Team" },
  { budget: "$5,200", project: "API Integration", status: "Pending", team: "Backend Team" },
  { budget: "$3,800", project: "Database Migration", status: "Paid", team: "DevOps Team" },
  { budget: "$7,200", project: "User Dashboard", status: "Paid", team: "UX Team" },
  { budget: "$2,100", project: "Security Audit", status: "Failed", team: "Security Team" },
] as const;

const statusDotColor: Record<(typeof projects)[number]["status"], string> = {
  Failed: "bg-red-500",
  Paid: "bg-emerald-500",
  Pending: "bg-amber-500",
  Unpaid: "bg-muted-foreground/64",
};

export function BasicTable() {
  return (
    <Table>
      <TableCaption>A list of current projects.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-right">Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((row) => (
          <TableRow key={row.project}>
            <TableCell className="font-medium">{row.project}</TableCell>
            <TableCell>
              <Badge variant="outline">
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${statusDotColor[row.status]}`}
                />
                {row.status}
              </Badge>
            </TableCell>
            <TableCell>{row.team}</TableCell>
            <TableCell className="text-right">{row.budget}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Budget</TableCell>
          <TableCell className="text-right">$39,550</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
