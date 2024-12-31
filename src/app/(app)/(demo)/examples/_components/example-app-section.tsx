import { ExamplesNav } from "@/app/(app)/(demo)/examples/_components/examples-nav";
import AuthenticationPage from "@/app/(app)/(demo)/examples/authentication/page";
import CardsPage from "@/app/(app)/(demo)/examples/cards/page";
import DashboardPage from "@/app/(app)/(demo)/examples/dashboard/page";
import FormsPage from "@/app/(app)/(demo)/examples/forms/page";
import MailPage from "@/app/(app)/(demo)/examples/mail/page";
import MusicPage from "@/app/(app)/(demo)/examples/music/page";
import PlaygroundPage from "@/app/(app)/(demo)/examples/playground/page";
import TasksPage from "@/app/(app)/(demo)/examples/tasks/page";
import { Section, SectionHeader } from "@/components/primitives/section";
import { BorderBeam } from "@/components/ui/border-beam";

export const examples = [
	{
		name: "Mail",
		href: "/examples/mail",
		code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/mail",
		component: MailPage,
	},
	{
		name: "Dashboard",
		href: "/examples/dashboard",
		code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/dashboard",
		component: DashboardPage,
	},
	{
		name: "Cards",
		href: "/examples/cards",
		code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/cards",
		component: CardsPage,
	},
	{
		name: "Tasks",
		href: "/examples/tasks",
		code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/tasks",
		component: TasksPage,
	},
	{
		name: "Playground",
		href: "/examples/playground",
		code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/playground",
		component: PlaygroundPage,
	},
	{
		name: "Forms",
		href: "/examples/forms",
		code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/forms",
		component: FormsPage,
	},
	{
		name: "Music",
		href: "/examples/music",
		code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/music",
		component: MusicPage,
	},
	{
		name: "Authentication",
		href: "/examples/authentication",
		code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/authentication",
		component: AuthenticationPage,
	},
];

export const ExampleAppSection = ({
	current,
	className,
}: {
	current?: string;
	className?: string;
}) => {
	if (!current) {
		// Randomly select an example
		const randomIndex = Math.floor(Math.random() * examples.length);
		current = examples[randomIndex]?.name;
	}

	const currentExample = examples.find((example) => example.name === current);

	return (
		<Section className={className}>
			<SectionHeader>Build apps like these</SectionHeader>
			<ExamplesNav current={current} />

			<div className="relative flex max-h-[400px] max-w-full flex-col overflow-hidden rounded-lg border bg-background [mask-image:linear-gradient(to_bottom,white,transparent)] md:shadow-xl">
				{currentExample?.component ? (
					<currentExample.component />
				) : (
					<MusicPage />
				)}
				<BorderBeam size={250} duration={12} delay={9} />
			</div>
		</Section>
	);
};
