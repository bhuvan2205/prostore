import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UnAuthorized Access",
};

export const UnAuthorized = async () => {
  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="h1-bold text-4xl">UnAuthorized Access</h1>
        <p className="text-muted-foreground">
          You do not have permission to access this page
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </>
  );
};
