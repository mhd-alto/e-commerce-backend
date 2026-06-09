import { Schema, model } from "mongoose";

const UsersSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: Number,
      required: true,
      min: 0,
    },

    password: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    code: {
      type: Number,
      default: 0,
      min: 0,
    },

    isverified: {
      type: String,
      required: true,
      trim: true,
    },


  },
  {
    timestamps: true,
  }
);

const UsersModel = model("users", UsersSchema);

export default UsersModel;