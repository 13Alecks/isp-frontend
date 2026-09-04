"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { Button, Card, CardContent, Input, Label } from "@/shared/components/ui";
import { useSignup, useCreateSession } from "@/features/auth/api";
import type { SignupPayload } from "@/features/auth/types";

export function SignupForm() {
  const router = useRouter();
  const signup = useSignup();
  const createSession = useCreateSession();
  const [formData, setFormData] = React.useState<SignupPayload>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);

  const passwordChecks = {
    length: formData.password.length >= 6,
    match:
      formData.confirmPassword.length > 0 &&
      formData.password === formData.confirmPassword,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const user = await signup.mutateAsync(formData);
      const idToken = await user.getIdToken();
      await createSession.mutateAsync(idToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isPending = signup.isPending || createSession.isPending;

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started with the Intelligent Student Platform
        </p>
      </div>

      <Card className="shadow-lg shadow-foreground/5 ring-foreground/10">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5">
                <AlertCircle className="size-5 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isPending}
                autoComplete="email"
                autoFocus
                className="h-11 rounded-lg px-4 text-sm"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11 rounded-lg px-4 pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
              {formData.password.length > 0 && (
                <div className="flex items-center gap-1.5 pt-0.5 text-xs">
                  <Check
                    className={`size-3.5 ${passwordChecks.length ? "text-green-600" : "text-muted-foreground"}`}
                  />
                  <span className={passwordChecks.length ? "text-foreground" : "text-muted-foreground"}>
                    At least 6 characters
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isPending}
                minLength={6}
                autoComplete="new-password"
                className={`h-11 rounded-lg px-4 text-sm ${passwordChecks.match ? "border-green-500/50" : ""}`}
              />
              {formData.confirmPassword.length > 0 && (
                <div className="flex items-center gap-1.5 pt-0.5 text-xs">
                  <Check
                    className={`size-3.5 ${passwordChecks.match ? "text-green-600" : "text-muted-foreground"}`}
                  />
                  <span className={passwordChecks.match ? "text-foreground" : "text-muted-foreground"}>
                    {passwordChecks.match ? "Passwords match" : "Passwords don't match yet"}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-2 h-11 w-full text-sm font-medium"
              disabled={isPending}
            >
              {isPending ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
