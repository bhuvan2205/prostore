import { clsx, type ClassValue } from "clsx";
import queryString from "query-string";
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

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

export const formatCurrency = (value: number | string | null) => {
  if (typeof value === "number") {
    return CURRENCY_FORMATTER.format(value);
  } else if (typeof value === "string") {
    return CURRENCY_FORMATTER.format(Number(value));
  }

  return "NaN";
};

export const formatId = (id: string) => {
  return id.substring(0, 6);
};

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const urlQuery = (payload: {
  params: string;
  key: string;
  value: string | null;
}) => {
  const { params, key, value } = payload || {};
  const query = queryString.parse(params);
  query[key] = value;

  return queryString.stringifyUrl(
    { url: window.location.pathname, query },
    { skipNull: true }
  );
};
