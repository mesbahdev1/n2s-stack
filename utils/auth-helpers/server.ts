'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
import { getAuthTypes } from '@/utils/auth-helpers/settings';
import { revalidatePath } from 'next/cache';
function isValidEmail(email: string) {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	return regex.test(email);
}

export async function redirectToPath(path: string) {
	return redirect(path);
}

export async function SignOut(formData: FormData) {
	const pathName = String(formData.get('pathName')).trim();

	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		return getErrorRedirect(
			pathName,
			'Hmm... Something went wrong.',
			'You could not be signed out.',
		);
	}

	return '/signin';
}

export async function signInWithEmail(
	formData: FormData,
): Promise<{ message: string; type: string }> {
	const cookieStore = await cookies();
	const callbackURL = getURL('/auth/callback');

	const email = String(formData.get('email')).trim();
	let redirectPath: string;

	try {
		if (!isValidEmail(email)) {
			redirectPath = getErrorRedirect(
				'/signin/email_signin',
				'Invalid email address.',
				'Please try again.',
			);
		}

		const supabase = await createClient();
		const options = {
			emailRedirectTo: callbackURL,
			shouldCreateUser: true,
		};

		// If allowPassword is false, do not create a new user
		const { allowPassword } = getAuthTypes();
		if (allowPassword) options.shouldCreateUser = false;
		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: options,
		});

		if (error) {
			/*redirectPath = getErrorRedirect(
				'/signin/email_signin',
				'You could not be signed in.',
				error.message
			)*/

			throw new Error('You could not be signed in. ' + error.message);
		} else if (data) {
			cookieStore.set('preferredSignInView', 'email_signin', { path: '/' });
			/*redirectPath = getStatusRedirect(
				'/signin/email_signin',
				'Success!',
				'Please check your email for a magic link. You may now close this tab.',
				true
			)*/

			return {
				message:
					'Please check your email for a magic link. You may now close this tab.',
				type: 'success',
			};
		} else {
			throw new Error(
				'Hmm... Something went wrong. You could not be signed in.',
			);
			/*redirectPath = getErrorRedirect(
				'/signin/email_signin',
				'Hmm... Something went wrong.',
				'You could not be signed in.'
			);*/
		}

		//return redirectPath;
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, type: 'error' };
		} else {
			return { message: 'An unknown error occurred', type: 'error' };
		}
	}
}

export async function requestPasswordUpdate(
	formData: FormData,
): Promise<{ message: string; type: string }> {
	const callbackURL = getURL('/auth/reset_password');

	// Get form data
	const email = String(formData.get('email')).trim();

	const supabase = await createClient();

	try {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: callbackURL,
		});

		if (!isValidEmail(email)) {
			throw new Error('Invalid email address.');
		}

		if (error) {
			throw new Error(
				'Password reset email could not be sent. ' + error.message,
			);
		} else if (data) {
			return {
				message: 'Please check your email for a password reset link.',
				type: 'success',
			};
		} else {
			throw new Error('Password reset email could not be sent.');
		}
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, type: 'error' };
		} else {
			return { message: 'An unknown error occurred', type: 'error' };
		}
	}
}

export async function signInWithPassword(
	formData: FormData,
): Promise<{ message: string; type: string }> {
	const cookieStore = await cookies();
	const email = String(formData.get('email')).trim();
	const password = String(formData.get('password')).trim();

	const supabase = await createClient();
	const { error, data } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	try {
		if (error) {
			throw new Error('Sign in failed. ' + error.message);
		} else if (data.user) {
			cookieStore.set('preferredSignInView', 'password_signin', { path: '/' });
			return { message: 'You are now signed in.', type: 'success' };
		} else {
			throw new Error('Something went wrong. You could not be signed in.');
		}
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, type: 'error' };
		} else {
			return { message: 'An unknown error occurred', type: 'error' };
		}
	}
}

export async function signUp(formData: FormData): Promise<{
	message: string;
	type: string;
	data?: { email: string; name: string; userId: string };
}> {
	const callbackURL = getURL('/auth/callback');
	const cookieStore = await cookies();

	const name = String(formData.get('name')).trim();
	const email = String(formData.get('email')).trim();
	const password = String(formData.get('password')).trim();

	if (!isValidEmail(email)) {
		throw new Error('Invalid email address.');
	}

	const supabase = await createClient();

	try {
		// Sign up the user
		const { error, data } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: callbackURL,
				data: {
					full_name: name,
				},
			},
		});

		if (error) {
			const message =
				error.message === 'Database error saving new user' ? '' : error.message;
			throw new Error('Sign up failed. ' + message);
		} else if (data.session) {
			return {
				message: 'Your account has been created.',
				type: 'success',
				data: { email: email, name: name, userId: data.user?.id || '' },
			};
		} else if (
			data.user &&
			data.user.identities &&
			data.user.identities.length == 0
		) {
			throw new Error(
				'There is already an account associated with this email address. Try resetting your password.',
			);
		} else if (data.user) {
			cookieStore.set('signupEmail', email, { path: '/' });
			return {
				message:
					'Please check your email for a confirmation link. You may now close this tab.',
				type: 'success',
				data: { email: email, name: name, userId: data.user.id },
			};
		} else {
			throw new Error('Something went wrong. You could not be signed up.');
		}
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, type: 'error' };
		} else {
			return { message: 'An unknown error occurred', type: 'error' };
		}
	}
}

export async function updateName(
	formData: FormData,
): Promise<{ message: string; type: string }> {
	const name = String(formData.get('name')).trim();

	const supabase = await createClient();

	try {
		const { error, data } = await supabase.auth.updateUser({
			data: { full_name: name },
		});

		if (error) {
			throw new Error(`Your profile could not be updated. ${error.message}`);
		} else if (data.user) {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				throw new Error(
					'Hmm... Something went wrong. Your profile could not be updated.',
				);
			}
			const { error } = await supabase
				.from('User')
				.update({
					name: name,
				})
				.eq('id', user.id);
			if (error) {
				throw new Error(
					'Hmm... Something went wrong. Your profile could not be updated.',
				);
			}
			revalidatePath('/preferences');
			return { message: 'Your profile has been updated.', type: 'success' };
		} else {
			throw new Error(
				'Hmm... Something went wrong. Your profile could not be updated.',
			);
		}
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, type: 'error' };
		} else {
			return { message: 'An unknown error occurred', type: 'error' };
		}
	}
}

export async function updatePassword(
	formData: FormData,
): Promise<{ message: string; type: string }> {
	const password = String(formData.get('password')).trim();
	const passwordConfirm = String(formData.get('passwordConfirm')).trim();

	// Check that the password and confirmation match
	if (password !== passwordConfirm) {
		throw new Error(
			'Your password could not be updated. Passwords do not match.',
		);
	}

	const supabase = await createClient();

	try {
		const { error, data } = await supabase.auth.updateUser({
			password,
		});

		if (error) {
			throw new Error(`Your password could not be updated. ${error.message}`);
		} else if (data.user) {
			return { message: 'Your password has been updated.', type: 'success' };
		} else {
			throw new Error(
				'Hmm... Something went wrong. Your password could not be updated.',
			);
		}
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, type: 'error' };
		} else {
			return { message: 'An unknown error occurred', type: 'error' };
		}
	}
}

export async function resendVerificationEmail(
	formData: FormData,
): Promise<{ message: string; type: string }> {
	const callbackURL = getURL('/auth/password_signin');

	const email = String(formData.get('email')).trim();

	if (!isValidEmail(email)) {
		throw new Error('Invalid email address.');
	}

	const supabase = await createClient();

	try {
		const { error } = await supabase.auth.resend({
			type: 'signup',
			email: email,
			options: {
				emailRedirectTo: callbackURL,
			},
		});
		if (error) {
			throw new Error(
				'Verification email could not be resent. please try again.',
			);
		} else {
			return {
				message: 'Verification email resent successfully',
				type: 'success',
			};
		}
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, type: 'error' };
		} else {
			return { message: 'An unknown error occurred', type: 'error' };
		}
	}
}

export async function updateEmail(formData: FormData) {
	// Get form data
	const newEmail = String(formData.get('newEmail')).trim();

	// Check that the email is valid
	if (!isValidEmail(newEmail)) {
		return getErrorRedirect(
			'/account',
			'Your email could not be updated.',
			'Invalid email address.',
		);
	}

	const supabase = await createClient();

	const callbackUrl = getURL(
		getStatusRedirect('/account', 'Success!', `Your email has been updated.`),
	);

	const { error } = await supabase.auth.updateUser(
		{ email: newEmail },
		{
			emailRedirectTo: callbackUrl,
		},
	);

	if (error) {
		return getErrorRedirect(
			'/account',
			'Your email could not be updated.',
			error.message,
		);
	} else {
		return getStatusRedirect(
			'/account',
			'Confirmation emails sent.',
			`You will need to confirm the update by clicking the links sent to both the old and new email addresses.`,
		);
	}
}

export async function updateNameOld(formData: FormData) {
	// Get form data
	const fullName = String(formData.get('fullName')).trim();

	const supabase = await createClient();
	const { error, data } = await supabase.auth.updateUser({
		data: { full_name: fullName },
	});

	if (error) {
		return getErrorRedirect(
			'/account',
			'Your name could not be updated.',
			error.message,
		);
	} else if (data.user) {
		return getStatusRedirect(
			'/account',
			'Success!',
			'Your name has been updated.',
		);
	} else {
		return getErrorRedirect(
			'/account',
			'Hmm... Something went wrong.',
			'Your name could not be updated.',
		);
	}
}
