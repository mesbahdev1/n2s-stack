'use client';
import { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { type User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { updateName } from '@/utils/auth-helpers/server';

export default function ProfileUpdate({ user }: { user: User }) {
	const { mutate: submit, isPending } = useMutation({
		mutationFn: updateName,
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
			}
		},
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submit(new FormData(e.currentTarget));
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>
					Fill in the form below to update your profile details.
				</CardDescription>
			</CardHeader>
			<CardContent className="max-w-sm">
				<form onSubmit={(e) => handleSubmit(e)}>
					<FieldGroup>
						<FieldSet>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="checkout-7j9-card-name-43j">
										Full name
									</FieldLabel>
									<Input
										autoCapitalize="none"
										autoComplete="current-password"
										autoCorrect="off"
										defaultValue={user.user_metadata.full_name}
										id="name"
										name="name"
										placeholder="Full name"
										required
										type="text"
									/>
								</Field>
							</FieldGroup>
						</FieldSet>
						<Field orientation="horizontal">
							<Button
								color="neutral"
								disabled={isPending}
								size="sm"
								type="submit"
							>
								{'Save'}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
