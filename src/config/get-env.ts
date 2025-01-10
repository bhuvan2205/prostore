export const variables = {
  NEXT_PUBLIC_APP_URL: "NEXT_PUBLIC_APP_URL",
};

export const getEnv = (key: keyof typeof variables) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
