import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/config/auth";
import { ROUTES } from "@/constants/routes";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignInForm from "./_components/signIn-form";

export const metadata: Metadata = {
  title: "Sign In",
};

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
};

const SignInPage = async (props: SignInPageProps) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();
  if (session) {
    return redirect(callbackUrl || ROUTES.HOME);
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
