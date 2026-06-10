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
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  },
);

const UsersModel = model("Users", UsersSchema);

export default UsersModel;
