import { APP_NAME } from "@/constants/pages";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <p className="p-5 text-center">
        {currentYear} {APP_NAME}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
