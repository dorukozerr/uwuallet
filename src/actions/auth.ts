"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { hash, compare } from "bcryptjs";
import { verify, sign } from "jsonwebtoken";
import { getCollection } from "@/lib/mongo";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env!");
}

export const checkAuth = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return { success: false };
    }

    const verifiedToken = verify(token.value, JWT_SECRET);

    const username = (verifiedToken as { username: string }).username;

    return { success: true, username };
  } catch (error) {
    console.error("/auth/checkAuth error =>", error);

    return { success: false };
  }
};

export const register = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const collection = await getCollection("users");
    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      return { success: false, message: "Username already exists." };
    }

    const hashedPassword = await hash(password, 10);

    await collection.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return login({ username, password });
  } catch (error) {
    console.error("/auth/register error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const user = await (await getCollection("users")).findOne({ username });

    if (!user) {
      return { success: false, message: "Invalid credentials." };
    }

    const doesPasswordsMatch = await compare(password, user.password);

    if (!doesPasswordsMatch) {
      return { success: false, message: "Invalid credentials." };
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: "token",
      value: sign({ username }, JWT_SECRET, { expiresIn: "24h" }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });

    revalidatePath("/");

    return { success: true, message: "Login successful." };
  } catch (error) {
    console.error("/auth/login error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const logout = async () => {
  try {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated.success) {
      return { success: false, message: "Not Authenticated." };
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    revalidatePath("/");

    return { success: true, message: "Logout successful." };
  } catch (error) {
    console.error("/auth/logout error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};
