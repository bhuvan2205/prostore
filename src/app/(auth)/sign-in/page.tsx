import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SignInForm from "./_components/signIn-form";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Sign In",
};

const SignInPage = async () => {
  const session = await auth();
  if (session) {
    return redirect(ROUTES.HOME);
  }

  return (
    <div className="w-full mx-auto max-w-md">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={100}
              height={100}
              priority
            />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
          <CardContent className="space-y-4">
            <SignInForm />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SignInPage;
