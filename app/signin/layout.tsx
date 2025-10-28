export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex h-[calc(100dvh-260px)] items-center justify-center">
			<div className="flex flex-col items-center space-y-8">{children}</div>
		</div>
	);
}
