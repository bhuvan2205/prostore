import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./_components/signUp-form";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Sign In",
};

type SignUpPageProps = {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
};

const SignUpPage = async (props: SignUpPageProps) => {
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
            <SignUpForm />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SignUpPage;
