import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<div>
			<div className="container-wrapper">
				<div className="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
					<h1 className="text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter max-w-4xl">
						This is N2S Stack
					</h1>
					<p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
						N2S stands for Next.js + Supabase + Shadcn UI
					</p>
					<p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
						I use this stack to build almost any web project that requires
						authentication and database.
					</p>
					<div className="flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none">
						<Button asChild>
							<Link href="https://github.com/mesbahdev/n2s-stack">
								View on GitHub
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
