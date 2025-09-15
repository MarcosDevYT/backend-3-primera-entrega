import { IUser } from "../dao/models/user.model.js";
import bcrypt from "bcrypt";
import path from "path";

export const createHash = async (password: string) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
};

export const passwordValidation = async (
  user: IUser,
  password: string
): Promise<boolean> => {
  return bcrypt.compare(password, user.password);
};

const __dirname = path.resolve();
export default __dirname;
