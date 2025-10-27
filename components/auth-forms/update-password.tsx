'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
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
		<form
			className="mt-6 space-y-4"
			noValidate={true}
			onSubmit={(e) => handleSubmit(e)}
		>
			<div>
				<div className="flex items-center justify-between">
					<Label
						htmlFor="password"
						className="text-sm font-medium text-foreground dark:text-foreground"
					>
						{'New Password'}
					</Label>
				</div>
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
			<div>
				<div className="flex items-center justify-between">
					<Label
						htmlFor="passwordConfirm"
						className="text-sm font-medium text-foreground dark:text-foreground"
					>
						{'New Password'}
					</Label>
				</div>
				<Input
					autoComplete="password"
					className="mt-2"
					id="passwordConfirm"
					name="passwordConfirm"
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
				{'Update Password'}
			</Button>
		</form>
	);
}
