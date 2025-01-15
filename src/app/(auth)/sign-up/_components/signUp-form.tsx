"use client";

import { signUpUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const SignUpForm = () => {
  const [data, action, pending] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.HOME;

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="name"
            placeholder="Enter your name"
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="password"
          />
        </div>
        <div>
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            autoComplete="password"
          />
        </div>

        {!!data && !data?.success && (
          <div className="text-center text-destructive">{data?.message}</div>
        )}

        <div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing up..." : "Sign Up"}
          </Button>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="link">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
