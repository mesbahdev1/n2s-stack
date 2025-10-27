'use client';

import { FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { handleRequest } from '@/utils/auth-helpers/client';
import { SignOut } from '@/utils/auth-helpers/server';

export default function UserMenu() {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = (e: FormEvent<HTMLFormElement>) => {
		handleRequest(e, SignOut, router);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm">{'My Account'}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48" align="end">
				<DropdownMenuItem>
					<Link href="/account">{'Preferences'}</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<form onSubmit={handleLogout}>
						<input name="pathName" type="hidden" value={pathname} />
						<Button
							className="w-full justify-start p-0 font-normal h-auto"
							size="sm"
							type="submit"
							variant="ghost"
						>
							{'Log out'}
						</Button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
