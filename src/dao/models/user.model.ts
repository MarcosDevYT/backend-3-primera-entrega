import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  password: string;
  role: "user" | "admin";
  pets: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  pets: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pets",
      },
    ],
    default: [],
  },
});

const UserModel = mongoose.model<IUser>("users", userSchema);

export default UserModel;
