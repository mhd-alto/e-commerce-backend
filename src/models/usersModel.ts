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
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      min: 0,
      select: false,
    },

    code: {
      type: String,
      default: "",
    },

    codeExpires: {
      type: Date,
    },

    isverified: {
      type: Boolean,
      required: true,
      default: false,
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

const UsersModel = model("Users", UsersSchema);

export default UsersModel;
