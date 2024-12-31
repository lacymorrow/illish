import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ActivityLogErrorProps {
	error: Error;
	reset: () => void;
}

export function ActivityLogError({ error, reset }: ActivityLogErrorProps) {
	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Activity Log</CardTitle>
				</CardHeader>
				<CardContent>
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error Loading Activity Log</AlertTitle>
						<AlertDescription className="mt-2 space-y-4">
							<p>{error.message}</p>
							<Button
								variant="outline"
								size="sm"
								onClick={reset}
								className="gap-2"
							>
								<RefreshCcw className="h-4 w-4" />
								Try Again
							</Button>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		</div>
	);
}
