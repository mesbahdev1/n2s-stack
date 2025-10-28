import Link from 'next/link';
import { Button } from '@/components/ui/button';

const stackLayers = [
	{
		title: 'Next.js',
		points: [
			'Built on Next.js 16, so you benefit from the latest performance upgrades',
			'Smooth page transitions and instant loading keep your app feeling snappy',
			'Built-in SEO tooling helps your product get discovered without extra plugins',
			'Flexible layouts make it easy to grow features without reworking everything',
		],
	},
	{
		title: 'Supabase',
		points: [
			'Secure data lives in Postgres without you managing servers or backups',
			'Realtime updates keep teams and customers aligned the moment things change',
			'One login system supports email, magic links, and social sign-ins out of the box',
		],
	},
	{
		title: 'shadcn/ui',
		points: [
			'Polished UI components give you a professional look from day one',
			'Accessible patterns mean everyone can comfortably use your product',
			'Consistent styling keeps every page feeling like part of the same story',
		],
	},
];

const productivityBoosts = [
	'Launch a working SaaS-style dashboard in minutes instead of days of setup',
	'Use ready-to-go Supabase Auth screens for email/password, magic links, and OAuth',
	'Stay organized with a project structure that keeps features easy to find',
	'Develop locally with everything pre-configured—no manual setup chores',
];

export default function Home() {
	return (
		<div>
			<div className="container-wrapper">
				<div className="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
					<h1 className="text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter max-w-4xl">
						This is N2S Stack
					</h1>
					<p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
						N2S stands for Next.js + Supabase + shadcn/ui — a balanced toolkit
						for launching polished web products without reinventing the basics.
						This starter runs on Next.js 16 so you can roll out modern features
						with confidence.
					</p>
					<p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
						Start with dependable building blocks for accounts, data, and
						design, then spend your time shaping the experience your customers
						care about. Supabase Auth ships configured with sign-in, sign-up,
						and password reset flows so you can welcome users on day one.
					</p>
					<div className="flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none">
						<Button asChild>
							<Link href="https://github.com/mesbahdev1/n2s-stack">
								View on GitHub
							</Link>
						</Button>
					</div>
				</div>
			</div>

			<div className="container-wrapper border-border border-t border-dashed">
				<div className="container grid gap-8 py-12 lg:grid-cols-3 lg:py-16">
					{stackLayers.map((layer) => (
						<div
							key={layer.title}
							className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-background p-6 text-left shadow-sm transition hover:shadow-md"
						>
							<h2 className="text-foreground text-2xl font-semibold">
								{layer.title}
							</h2>
							<ul className="space-y-3 text-sm text-muted-foreground">
								{layer.points.map((point) => (
									<li key={point} className="flex items-start gap-3">
										<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
										<span>{point}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="container-wrapper">
				<div className="container flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
					<div className="max-w-2xl space-y-4">
						<h2 className="text-foreground text-3xl font-semibold">
							Launch faster with strong foundations
						</h2>
						<p className="text-muted-foreground text-base">
							The N2S starter trims the setup phase so you can focus on solving
							problems for your users. Bring your product requirements, and the
							stack handles the boring yet critical plumbing.
						</p>
					</div>
					<ul className="max-w-xl space-y-3 text-sm text-muted-foreground">
						{productivityBoosts.map((item) => (
							<li key={item}>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
