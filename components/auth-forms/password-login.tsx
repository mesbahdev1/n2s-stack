'use client';

import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signInWithPassword } from '@/utils/auth-helpers/server';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
	allowEmail: boolean;
	allowOauth: boolean;
	redirectMethod: string;
}

export default function PasswordSignIn({
	allowEmail,
	allowOauth,
	redirectMethod,
}: PasswordSignInProps) {
	const { mutate: submit, isPending } = useMutation({
		mutationFn: signInWithPassword,
		onError: () => {
			toast.error('Something went wrong. Please try again.');
		},
		onSuccess: (result: { type: string; message: string }) => {
			if (result.type === 'error') {
				toast.error(result.message.toString());
			} else {
				toast.success(result.message.toString());
			}
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submit(new FormData(e.currentTarget));
	};

	return (
		<>
			<form className="mt-6 space-y-4" onSubmit={(e) => handleSubmit(e)}>
				<div>
					<Label
						htmlFor="email"
						className="text-sm font-medium text-foreground dark:text-foreground"
					>
						{'Email'}
					</Label>
					<Input
						autoCapitalize="none"
						autoComplete="email"
						className="mt-2"
						disabled={isPending}
						id="email"
						name="email"
						placeholder="name@example.com"
						required
						type="email"
					/>
				</div>
				<div>
					<div className="flex items-center justify-between">
						<Label
							htmlFor="password"
							className="text-sm font-medium text-foreground dark:text-foreground"
						>
							{'Password'}
						</Label>
						<Link
							className="text-sm font-medium text-muted-foreground hover:text-primary/90 hover:dark:text-primary/90"
							href="/signin/forgot_password"
						>
							{'Forgot Password?'}
						</Link>
					</div>
					<Input
						autoComplete="password"
						className="mt-2"
						id="password"
						name="password"
						placeholder="**************"
						required
						type="password"
					/>
				</div>
				<Button
					className="mt-4 w-full py-2 font-medium"
					disabled={isPending}
					type="submit"
				>
					{'Login'}
				</Button>
			</form>

			{allowEmail && (
				<p className="mt-4 text-sm text-muted-foreground dark:text-muted-foreground text-center">
					{'Or sign In Via'}{' '}
					<Link
						className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
						href="/signin/email_signin"
					>
						{'Magic Link'}
					</Link>
				</p>
			)}
		</>
	);
}
