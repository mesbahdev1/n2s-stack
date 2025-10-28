'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signInWithEmail } from '@/utils/auth-helpers/server';

// Define prop type with allowPassword boolean
interface EmailSignInProps {
	allowPassword: boolean;
	redirectMethod: string;
	disablebutton?: boolean;
}

export default function EmailSignIn({
	allowPassword,
	redirectMethod,
	disablebutton,
}: EmailSignInProps) {
	const { mutate: submit, isPending } = useMutation({
		mutationFn: signInWithEmail,
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
		<form
			className="mt-6 space-y-4"
			noValidate={true}
			onSubmit={(e) => handleSubmit(e)}
		>
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
				disabled={isPending}
				type="submit"
			>
				{'Send me the magic link'}
			</Button>
		</form>
	);
}
