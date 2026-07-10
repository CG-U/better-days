"use client";

import { LogOut } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { QueryError } from "@/components/query-error";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { DeleteAccountForm } from "@/features/settings/components/delete-account-form";
import { PasswordForm } from "@/features/settings/components/password-form";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { useProfile } from "@/features/settings/hooks/use-settings";

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden>
      <Skeleton className="h-44 rounded-2xl" />
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-44 rounded-2xl" />
    </div>
  );
}

export default function SettingsPage() {
  const profile = useProfile();
  const logout = useLogout();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/dashboard" label="Back to dashboard" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Your Profile
        </h1>
        <span aria-hidden className="size-12" />
      </header>
      <p className="text-center text-muted-foreground">
        How you show up here is yours to choose.
      </p>

      {profile.isPending ? (
        <SettingsSkeleton />
      ) : profile.isError ? (
        <QueryError
          message="We could not load your profile."
          onRetry={() => void profile.refetch()}
          isRetrying={profile.isFetching}
        />
      ) : (
        <>
          <ProfileForm profile={profile.data.profile} />
          <PasswordForm />

          {/* The phone layout has no top nav, so this is the sign-out on mobile. */}
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-full border-warning text-warning hover:bg-warning-container hover:text-on-warning-container"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut aria-hidden className="size-5" />
            {logout.isPending ? "Signing out..." : "Sign out"}
          </Button>

          {/* Last on the page, after the ordinary way to leave. */}
          <DeleteAccountForm />
        </>
      )}
    </main>
  );
}
