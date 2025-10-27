'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUp } from '@/utils/auth-helpers/server';

// Define prop type with allowEmail boolean
interface SignUpProps {
	allowEmail: boolean;
	redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
	const router = useRouter();

	const { mutate: submit, isPending } = useMutation({
		mutationFn: signUp,
		onError: () => {
			toast.error('Something went wrong. Please try again.');
		},
		onSuccess: async (result: {
			type: string;
			message: string;
			data?: { email: string; name: string; userId: string };
		}) => {
			if (result.type === 'error') {
				toast.error(result.message.toString());
			} else {
				toast.success(result.message.toString());
				router.push(`/home`);
			}
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submit(new FormData(e.currentTarget));
	};

	return (
		<div>
			<form
				className="mt-6 space-y-4"
				//noValidate={true}
				onSubmit={(e) => handleSubmit(e)}
			>
				<div>
					<Label
						htmlFor="name"
						className="text-sm font-medium text-foreground dark:text-foreground"
					>
						{'Name'}
					</Label>
					<Input
						autoCapitalize="none"
						autoComplete="name"
						className="mt-2"
						disabled={isPending}
						id="name"
						name="name"
						placeholder="Jon Doe"
						required
						type="text"
					/>
				</div>
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
					<Label
						htmlFor="password"
						className="text-sm font-medium text-foreground dark:text-foreground"
					>
						{'Password'}
					</Label>
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
					{'Sign up'}
				</Button>
			</form>
		</div>
	);
}
