import { LandingPageComponent } from "@/app/(app)/logs/_components/landing-page";
import { auth } from "@/server/auth";

const LandingPage = async () => {
	const session = await auth();
	const user = session?.user;
	return (
		<>
			<LandingPageComponent user={user} />
		</>
	);
};

export default LandingPage;
