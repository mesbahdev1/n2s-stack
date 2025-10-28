'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
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
		<form className="mt-6" noValidate={true} onSubmit={(e) => handleSubmit(e)}>
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
				</FieldSet>
				<Button disabled={isPending} type="submit">
					{'Send me the magic link'}
				</Button>
			</FieldGroup>
		</form>
	);
}
