import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

import PasswordUpdate from '@/components/account/password-update';
import ProfileUpdate from '@/components/account/profile-update';

export default async function Page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/signin');
	}

	return (
		<div className="flex flex-col gap-8">
			<h1 className="text-2xl font-semibold">{'My Account'}</h1>
			<div className="flex flex-col gap-4">
				<ProfileUpdate user={user} />
				<PasswordUpdate />
			</div>
		</div>
	);
}
