'use client';
import { FormEvent, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

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

import { updatePassword } from '@/utils/auth-helpers/server';

export default function PasswordUpdate() {
	const formRef = useRef<HTMLFormElement>(null);

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
				if (formRef.current) {
					formRef.current.reset();
				}
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
				<CardTitle>Password</CardTitle>
				<CardDescription>
					Fill in the form below to update your password.
				</CardDescription>
			</CardHeader>
			<CardContent className="max-w-sm">
				<form
					//noValidate={true}
					onSubmit={(e) => handleSubmit(e)}
					ref={formRef}
				>
					<FieldGroup>
						<FieldSet>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="checkout-7j9-card-name-43j">
										New Password
									</FieldLabel>
									<Input
										autoCapitalize="none"
										autoComplete="current-password"
										autoCorrect="off"
										id="password"
										name="password"
										placeholder={'∗∗∗∗∗∗∗∗∗'}
										required
										type="password"
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="checkout-7j9-card-name-43j">
										Confirm New Password
									</FieldLabel>
									<Input
										autoCapitalize="none"
										autoComplete="current-password"
										autoCorrect="off"
										id="passwordConfirm"
										name="passwordConfirm"
										placeholder={'∗∗∗∗∗∗∗∗∗'}
										required
										type="password"
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
								{'Update Password'}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
