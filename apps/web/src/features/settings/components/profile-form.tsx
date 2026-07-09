"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AVATAR_COLORS,
  UpdateProfileSchema,
  type UpdateProfileInput,
  type UserProfile,
} from "@better-days/shared";
import { Check, CircleCheck } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
import {
  AVATAR_COLOR_CLASSES,
  avatarInitial,
  UserAvatar,
} from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useUpdateProfile } from "../hooks/use-settings";

const COLOR_LABELS: Record<(typeof AVATAR_COLORS)[number], string> = {
  sage: "Sage",
  sky: "Sky",
  sand: "Sand",
  plum: "Plum",
  clay: "Clay",
};

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const updateProfile = useUpdateProfile();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      username: profile.username ?? "",
      avatarColor: profile.avatarColor ?? "sage",
    },
  });

  // Live preview: the avatar updates as the user types and picks a color.
  const username = useWatch({ control, name: "username" });
  const avatarColor = useWatch({ control, name: "avatarColor" });

  return (
    <form
      onSubmit={handleSubmit((values) => updateProfile.mutate(values))}
      className="flex flex-col gap-5"
      noValidate
    >
      <SectionCard className="flex flex-col items-center gap-3 text-center">
        <UserAvatar
          username={username}
          email={profile.email}
          color={avatarColor}
          className="size-20 text-3xl"
        />
        <div>
          <p className="font-heading text-xl font-semibold">
            {username?.trim() || profile.email.split("@")[0]}
          </p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="space-y-3">
          <Label htmlFor="username" className="text-xl font-semibold">
            Username
          </Label>
          <p className="text-sm text-muted-foreground">
            This is the name we greet you with. Letters, numbers, underscores,
            and hyphens.
          </p>
          <Input
            id="username"
            autoComplete="username"
            placeholder="e.g. river_walker"
            aria-invalid={!!errors.username}
            {...register("username")}
          />
          <FormError message={errors.username?.message} />
        </div>
      </SectionCard>

      <SectionCard>
        <Controller
          control={control}
          name="avatarColor"
          render={({ field }) => (
            <fieldset className="space-y-4">
              <legend className="text-xl font-semibold">Avatar color</legend>
              <p className="text-sm text-muted-foreground">
                Your avatar is the first letter of your username. Pick a color
                that feels like you.
              </p>
              <div className="flex flex-wrap gap-3">
                {AVATAR_COLORS.map((color) => {
                  const selected = field.value === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      aria-pressed={selected}
                      aria-label={COLOR_LABELS[color]}
                      onClick={() => field.onChange(color)}
                      className={cn(
                        "focus-ring flex size-12 items-center justify-center rounded-full border-2 font-heading text-lg font-bold transition-all duration-200 ease-in-out",
                        AVATAR_COLOR_CLASSES[color],
                        selected
                          ? "border-foreground"
                          : "border-transparent hover:border-foreground/30",
                      )}
                    >
                      <span aria-hidden>
                        {selected ? (
                          <Check className="size-5" />
                        ) : (
                          avatarInitial(username, profile.email)
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        />
        <FormError message={errors.avatarColor?.message} />
      </SectionCard>

      <FormError message={updateProfile.error?.message} />

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={updateProfile.isPending}
      >
        <CircleCheck aria-hidden className="size-5" />
        {updateProfile.isPending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
