import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const convertToPlainObject = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const formatNumberWithDecimal = (num: number) => {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatErrors = (error: any) => {
  if (error.name === "ZodError") {
    const errors = Object.keys(error.errors).map((key) => {
      console.log(error.errors[key]);
      return error.errors[key].message;
    });

    return errors.join(", ");
  } else if (
    error.name === "PrismaClientValidationError" &&
    error.code === "P2002"
  ) {
    const field = (
      error.meta?.target ? error.meta?.target[0] : "Field"
    ) as string;
    return `${capitalize(field)} already exists`;
  } else {
    if (typeof error.message === "string") {
      return error.message;
    }
    return "Request failed";
  }
};

export const roundTwoDigit = (value: number | string) => {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Invalid input type");
  }
};
