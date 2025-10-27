import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: NextRequest) {
	// The `/auth/callback` route is required for the server-side auth flow implemented
	// by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get('code');
	const next = requestUrl.searchParams.get('next') ?? '/';
	const supabase = await createClient();
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			return NextResponse.redirect(
				getErrorRedirect(
					`${requestUrl.origin}/signin`,
					error.name,
					"Sorry, we weren't able to log you in. Please try again.",
				),
			);
		}

		if (!error) {
			const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === 'development';
			if (isLocalEnv) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				const origin = requestUrl.origin;
				return NextResponse.redirect(`${origin}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}

	// URL to redirect to after sign in process completes
	return NextResponse.redirect(
		getStatusRedirect(
			`${requestUrl.origin}/`,
			'Success!',
			'You are now signed in.',
		),
	);
}
