import { Footer } from "@/components/footers/footer";
import { Header } from "@/components/headers/header";
import MainLayout from "@/components/layouts/main-layout";
import type React from "react";

const navLinks = [
	{
		label: "Log",
		href: "https://log.bones.sh",
	},
	{
		label: "UI",
		href: "https://ui.bones.sh",
	},
	{
		label: "Shipkit",
		href: "https://shipkit.io",
	}
];

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <MainLayout header={<Header navLinks={navLinks} />} footer={<Footer />}>{children}</MainLayout>;
}
