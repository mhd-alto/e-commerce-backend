import { Schema, model } from "mongoose";

const UsersSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      min: 0,
    },

    password: {
      type: String,
      required: true,
      min: 0,
      default: 0,
      select: false,
    },

    code: {
      type: Number,
      default: 0,
      min: 0,
    },

    isverified: {
      type: Boolean,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const UsersModel = model("users", UsersSchema);

export default UsersModel;
