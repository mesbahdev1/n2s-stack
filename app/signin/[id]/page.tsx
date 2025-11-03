import { createClient } from '@/utils/supabase/server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Separator } from '@/components/ui/separator';

import {
	getAuthTypes,
	getViewTypes,
	getDefaultSignInView,
	getRedirectMethod,
} from '@/utils/auth-helpers/settings';

import EmailSignIn from '@/components/auth-forms/email-login';
import EmailVerification from '@/components/auth-forms/email-verification';
import ForgotPassword from '@/components/auth-forms/forgot-password';
import OauthSignIn from '@/components/auth-forms/oauth-login';
import PasswordSignIn from '@/components/auth-forms/password-login';
import SignUp from '@/components/auth-forms/signup';
import UpdatePassword from '@/components/auth-forms/update-password';

export default async function SignIn(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;

	const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
	const viewTypes = getViewTypes();
	const redirectMethod = getRedirectMethod();

	// Declare 'viewProp' and initialize with the default value
	let viewProp: string;

	// Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
	if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
		viewProp = params.id;
	} else {
		const preferredSignInView =
			(await cookies()).get('preferredSignInView')?.value || null;
		viewProp = getDefaultSignInView(preferredSignInView);
		return redirect(`/signin/${viewProp}`);
	}

	// Check if the user is already logged in and redirect to the account page if so
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	let signUpEmail: string | null = null;
	if (!user && viewProp === 'email_verification') {
		signUpEmail = (await cookies()).get('signupEmail')?.value || null;
	}

	if (user && viewProp !== 'update_password') {
		return redirect('/');
	} else if (!user && viewProp === 'update_password') {
		return redirect('/signin');
	}

	return (
		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-semibold text-foreground">
					{viewProp === 'forgot_password'
						? 'Forgot your password?'
						: viewProp === 'update_password'
						? 'Update Password'
						: viewProp === 'signup'
						? 'Welcome!'
						: viewProp === 'email_verification'
						? 'Thank you for signing up!'
						: 'Welcome back!'}
				</h1>
				{viewProp === 'forgot_password' && (
					<p className="text-muted-foreground text-sm">
						{"Enter your email and we'll send you a code to reset the password"}
					</p>
				)}
				{viewProp === 'signup' && (
					<p className="text-muted-foreground text-sm">
						{'Already have an account?'}{' '}
						<Link href="/signin" className="text-foreground hover:underline">
							{'Login now'}
						</Link>
					</p>
				)}
				{viewProp === 'password_signin' && (
					<p className="text-muted-foreground text-sm">
						{'First time here?'}{' '}
						<Link
							href="/signin/signup"
							className="text-foreground hover:underline"
						>
							{'Sign up now'}
						</Link>
					</p>
				)}
				{viewProp === 'email_signin' && (
					<p className="text-muted-foreground text-sm">
						{
							'Enter your email and we’ll email you a magic link for a password-free sign in.'
						}
					</p>
				)}
			</div>

			{viewProp === 'email_verification' && (
				<EmailVerification signUpEmail={signUpEmail} />
			)}
			{viewProp === 'password_signin' && (
				<PasswordSignIn
					allowEmail={allowEmail}
					redirectMethod={redirectMethod}
				/>
			)}
			{viewProp === 'email_signin' && (
				<EmailSignIn
					allowPassword={allowPassword}
					redirectMethod={redirectMethod}
				/>
			)}
			{viewProp === 'forgot_password' && (
				<ForgotPassword
					allowEmail={allowEmail}
					redirectMethod={redirectMethod}
				/>
			)}
			{viewProp === 'update_password' && (
				<UpdatePassword redirectMethod={redirectMethod} />
			)}
			{viewProp === 'signup' && (
				<SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
			)}

			{(viewProp === 'email_signin' || viewProp === 'password_signin') &&
				allowOauth && (
					<div>
						{' '}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									or
								</span>
							</div>
						</div>
						<OauthSignIn view={viewProp} />
					</div>
				)}

			<p className="mt-6 text-center text-xs text-muted-foreground dark:text-muted-foreground">
				By signing in, you agree to our{' '}
				<a
					href="#"
					className="capitalize text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
				>
					Terms of use
				</a>{' '}
				and{' '}
				<a
					href="#"
					className="capitalize text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
				>
					Privacy policy
				</a>
			</p>
		</div>
	);
}
