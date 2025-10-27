export default function Footer() {
	return (
		<div className="border-border border-dashed border-t">
			<div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-8 border-border border-dotted border-r border-l">
				<footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-5">
					<div className="text-balance text-sm leading-loose text-muted-foreground">
						{'Built by'}{' '}
						<a
							href="https://mesbah.dev"
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
							data-umami-event="View Website"
						>
							{'mesbah.dev'}
						</a>
					</div>
					<div className="text-balance text-sm leading-loose text-muted-foreground">
						{'The source code is available on'}{' '}
						<a
							href="https://github.com/mesbahdev/n2s-stack"
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
							data-umami-event="View GitHub Repository"
						>
							{'GitHub'}
						</a>
						.
					</div>
				</footer>
			</div>
		</div>
	);
}
