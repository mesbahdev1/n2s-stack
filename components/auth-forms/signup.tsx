'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

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
				className="mt-6"
				//noValidate={true}
				onSubmit={(e) => handleSubmit(e)}
			>
				<FieldGroup>
					<FieldSet>
						<Field>
							<FieldLabel>{'Name'}</FieldLabel>
							<Input
								autoCapitalize="none"
								autoComplete="name"
								disabled={isPending}
								id="name"
								name="name"
								placeholder="Jon Doe"
								required
								type="text"
							/>
						</Field>
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
							<FieldLabel>{'Password'}</FieldLabel>
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
						{'Sign up'}
					</Button>
				</FieldGroup>
			</form>
		</div>
	);
}
