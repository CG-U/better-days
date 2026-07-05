"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogout, useMe } from "@/features/auth/hooks/use-auth";

export default function DashboardPage() {
  const { data, isPending } = useMe();
  const logout = useLogout();

  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-6 p-5 md:p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Better Days
        </h1>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {logout.isPending ? "Signing out..." : "Sign out"}
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {isPending ? "Welcome back" : `Welcome back, ${data?.user.email}`}
          </CardTitle>
          <CardDescription>
            Your recovery dashboard is on its way. Every day is another
            opportunity to make progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Streaks, savings, and recent activity will appear here soon.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
