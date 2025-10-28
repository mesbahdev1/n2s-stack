'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updatePassword } from '@/utils/auth-helpers/server';

interface UpdatePasswordProps {
	redirectMethod: string;
}

export default function UpdatePassword({
	redirectMethod,
}: UpdatePasswordProps) {
	const router = useRouter();

	const { mutate: submit, isPending } = useMutation({
		mutationFn: updatePassword,
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Something went wrong. Please try again.');
			}
		},
		onSuccess: (result: { type: string; message: string }) => {
			if (result.type === 'error') {
				toast.error(result.message.toString());
			} else {
				toast.success(result.message.toString());
				router.push('/');
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
						<FieldLabel>{'New Password'}</FieldLabel>
						<Input
							autoComplete="password"
							id="password"
							name="password"
							placeholder="**************"
							required
							type="password"
						/>
					</Field>
					<Field>
						<FieldLabel>{'Confirm New Password'}</FieldLabel>
						<Input
							autoComplete="password"
							id="passwordConfirm"
							name="passwordConfirm"
							placeholder="**************"
							required
							type="password"
						/>
					</Field>
				</FieldSet>
				<Button disabled={isPending} type="submit">
					{'Update Password'}
				</Button>
			</FieldGroup>
		</form>
	);
}
