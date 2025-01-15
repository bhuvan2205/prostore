"use server";

import { signIn, signOut } from "@/config/auth";
import { prisma } from "@/config/db";
import { HASH_SALT_ROUNDS } from "@/constants/user";
import { formatErrors } from "@/lib/utils";
import { signInFormSchema, signUpFormSchema } from "@/lib/validator";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const signInWithCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid Credentials" };
  }
};

export const signOutUser = async () => {
  await signOut();
};

export const signUpUser = async (prevState: unknown, formData: FormData) => {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    console.log("user", user);

    const hashedPassword = hashSync(user.password, HASH_SALT_ROUNDS);

    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    console.log("createdUser", createdUser);

    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    console.log("true");

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.log("error", error);
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatErrors(error) };
  }
};
