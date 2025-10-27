'use client';

import { useState } from 'react';
import { type Provider } from '@supabase/supabase-js';
import { IconBrandGoogleFilled } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';

import { signInWithOAuth } from '@/utils/auth-helpers/client';

type OAuthProviders = {
	name: Provider;
	displayName: string;
	icon: React.ReactNode;
};

export default function OauthSignIn({ view }: { view: string }) {
	const oAuthProviders: OAuthProviders[] = [
		{
			displayName: 'Google',
			icon: <IconBrandGoogleFilled />,
			name: 'google',
		},
	];
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSubmitting(true); // Disable the button while the request is being handled
		await signInWithOAuth(e);
		setIsSubmitting(false);
	};

	return (
		<div className="flex flex-col space-y-2 mt-6">
			{oAuthProviders.map((provider) => (
				<div key={`provider-${provider.name}`}>
					<form key={provider.name} onSubmit={(e) => handleSubmit(e)}>
						<input name="provider" type="hidden" value={provider.name} />
						<Button
							className="w-full"
							disabled={isSubmitting}
							type="submit"
							variant="outline"
						>
							{provider.icon}
							{`${view === 'signup' ? 'Sign up' : 'Sign in'} with ${
								provider.displayName
							}`}
						</Button>
					</form>
				</div>
			))}
		</div>
	);
}
