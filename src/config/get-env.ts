export const variables = {
  NEXT_PUBLIC_APP_URL: "NEXT_PUBLIC_APP_URL",
  DATABASE_URL: "DATABASE_URL",
  PAYMENT_METHOD: "PAYMENT_METHOD",
  DEFAULT_PAYMENT_OPTION: "DEFAULT_PAYMENT_OPTION",
  PAYPAL_API_URL: "PAYPAL_API_URL",
  PAYPAL_CLIENT_ID: "PAYPAL_CLIENT_ID",
  PAYPAL_SECRET_ID: "PAYPAL_SECRET_ID",
};

export const getEnv = (key: keyof typeof variables) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
