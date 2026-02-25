import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models";
import { signToken } from "@/lib/utils/jwt";
import { AppError } from "@/lib/utils/errors";

const SALT_ROUNDS = 10;

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; email: string; name?: string } }> {
  await connectDB();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError(400, "Email já cadastrado");
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name: name.trim() || undefined,
  });
  const token = await signToken({
    userId: user._id.toString(),
    email: user.email,
  });
  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  };
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; email: string; name?: string } }> {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new AppError(401, "Email ou senha inválidos");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError(401, "Email ou senha inválidos");
  const token = await signToken({
    userId: user._id.toString(),
    email: user.email,
  });
  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  };
}
