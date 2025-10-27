'use client';

import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { requestPasswordUpdate } from '@/utils/auth-helpers/server';

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
	allowEmail: boolean;
	redirectMethod: string;
	disablebutton?: boolean;
}

export default function ForgotPassword({
	allowEmail,
	redirectMethod,
	disablebutton,
}: ForgotPasswordProps) {
	const { mutate: submit, isPending } = useMutation({
		mutationFn: requestPasswordUpdate,
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
		<div>
			<form className="mt-6 space-y-4" onSubmit={(e) => handleSubmit(e)}>
				<div>
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
					<Button
						className="mt-4 w-full py-2 font-medium"
						disabled={disablebutton}
						type="submit"
					>
						{'Reset Password'}
					</Button>
				</div>
			</form>
			<p className="mt-4 text-sm text-muted-foreground dark:text-muted-foreground text-center">
				{'You have your password?'}{' '}
				<Link
					className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
					href="/signin/password_signin"
				>
					{'Login'}
				</Link>
			</p>
		</div>
	);
}
