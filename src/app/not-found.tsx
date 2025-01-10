"use client";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/pages";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
        width={48}
        height={48}
        priority
      />
      <div className="p-6 rounded-lg shadow-md text-center w-1/3">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => (window.location.href = ROUTES.HOME)}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
