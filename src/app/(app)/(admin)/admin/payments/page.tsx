import { DataTable } from "@/components/ui/data-table/data-table";
import { getPaymentsWithUsers } from "@/lib/lemonsqueezy";
import { columns } from "./_components/columns";

/**
 * Admin payments page component that displays a data table of all payments
 */
export default async function PaymentsPage() {
	const payments = await getPaymentsWithUsers();

	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-8 text-3xl font-bold">Payment Management</h1>
			<DataTable
				columns={columns}
				data={payments}
				searchPlaceholder="Search payments..."
			/>
		</div>
	);
}
