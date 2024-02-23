import mongoose from "mongoose";
import { ApplicationError } from "../util/error/applicationError.js";

const dbSetUp = async (host, username, password, collection) => {
  try {
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@${host}/${collection}`,
      {
        retryWrites: true,
        w: "majority",
      }
    );

    console.log("Mongo DB Connected!");
  } catch (err) {
    console.error(err);
    throw new ApplicationError(500, "DB Connect Error");
  }
};

export default dbSetUp;
