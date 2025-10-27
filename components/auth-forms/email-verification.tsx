'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';

import { resendVerificationEmail } from '@/utils/auth-helpers/server';

export default function EmailVerification({
	signUpEmail: email,
}: {
	signUpEmail: string | null;
}) {
	const { mutate: submitResend, isPending } = useMutation({
		mutationFn: resendVerificationEmail,
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

	const handleResendSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submitResend(new FormData(e.currentTarget));
	};

	if (email === null) {
		return null;
	}

	return (
		<div className="mt-6 space-y-4">
			<div className="space-y-2">
				<p className="text-sm text-muted-foreground dark:text-muted-foreground">
					{`We have sent a verification email to: (${email}). Please check your inbox and follow the instructions to verify your email address.`}
				</p>
				<p className="text-sm text-muted-foreground dark:text-muted-foreground">
					{
						'If you do not see the email in your inbox, please check your spam or junk folder.'
					}
				</p>
			</div>
			<form
				//noValidate={true}
				onSubmit={(e) => handleResendSubmit(e)}
				style={{
					width: '100%',
				}}
			>
				<input type="hidden" name="email" value={email} />
				<Button className="w-full">{'Resend verification email'}</Button>
			</form>
		</div>
	);
}
