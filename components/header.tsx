import Link from 'next/link';

import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/user-menu';

export default async function Header() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div className="sticky top-0 z-50 border-border border-b border-dashed bg-background">
			<div className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between border-border border-r border-l border-dashed px-4 sm:px-8">
				<Link className="flex items-center space-x-1 py-5" href="/">
					<h1 className="font-semibold text-xl">N2S Stack</h1>
				</Link>
				<div className="flex items-center space-x-2">
					{user && <UserMenu />}
					{!user && (
						<div className="flex space-x-2">
							<Button asChild size="sm" variant="outline">
								<Link href="/signin/password_signin">{'Login'}</Link>
							</Button>
							<Button asChild size="sm">
								<Link href="/signin/signup">{'Sign Up'}</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
