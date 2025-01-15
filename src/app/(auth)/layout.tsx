import { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="flex-center min-h-screen w-full">
     {children}
    </div>
  );
};

export default AuthLayout;
