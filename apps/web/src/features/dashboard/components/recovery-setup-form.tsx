"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  RecoverySetupSchema,
  type RecoverySetupInput,
} from "@better-days/shared";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { useSaveRecovery } from "../hooks/use-dashboard";

export function RecoverySetupForm() {
  const saveRecovery = useSaveRecovery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverySetupInput>({
    resolver: zodResolver(RecoverySetupSchema),
  });

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Set up your journey</CardTitle>
        <CardDescription>
          Two quick questions so we can celebrate your progress with you.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={handleSubmit((values) => saveRecovery.mutate(values))}
        noValidate
      >
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recoveryStartDate">
              When did this chapter begin?
            </Label>
            <Input
              id="recoveryStartDate"
              type="date"
              aria-invalid={!!errors.recoveryStartDate}
              {...register("recoveryStartDate")}
            />
            <p className="text-xs text-muted-foreground">
              The day you decided to cut back or stop. Today works too.
            </p>
            <FormError message={errors.recoveryStartDate?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailySpend">
              On a typical day, about how much did you spend on gambling?
            </Label>
            <Input
              id="dailySpend"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="e.g. 35"
              aria-invalid={!!errors.dailySpend}
              {...register("dailySpend", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              A rough estimate is fine — we use it to show the money you are
              saving.
            </p>
            <FormError message={errors.dailySpend?.message} />
          </div>
          <FormError message={saveRecovery.error?.message} />
        </CardContent>
        <CardFooter className="mt-6">
          <Button
            type="submit"
            className="h-12 w-full rounded-full"
            disabled={saveRecovery.isPending}
          >
            {saveRecovery.isPending ? "Saving..." : "Start my dashboard"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
