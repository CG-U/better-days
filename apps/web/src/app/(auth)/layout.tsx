export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-5">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        Better Days
      </h1>
      {children}
    </main>
  );
}
