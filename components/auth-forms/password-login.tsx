'use client';

import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { signInWithPassword } from '@/utils/auth-helpers/server';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
	allowEmail: boolean;
	redirectMethod: string;
}

export default function PasswordSignIn({
	allowEmail,
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
			<form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
				<FieldGroup>
					<FieldSet>
						<Field>
							<FieldLabel>{'Email'}</FieldLabel>
							<Input
								autoCapitalize="none"
								autoComplete="email"
								disabled={isPending}
								id="email"
								name="email"
								placeholder="name@example.com"
								required
								type="email"
							/>
						</Field>
						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel>{'Password'}</FieldLabel>
								<Link
									className="text-sm font-medium text-muted-foreground hover:text-primary/90 hover:dark:text-primary/90"
									href="/signin/forgot_password"
								>
									{'Forgot Password?'}
								</Link>
							</div>
							<Input
								autoComplete="password"
								id="password"
								name="password"
								placeholder="**************"
								required
								type="password"
							/>
						</Field>
					</FieldSet>
					<Button disabled={isPending} type="submit">
						{'Login'}
					</Button>
				</FieldGroup>
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
