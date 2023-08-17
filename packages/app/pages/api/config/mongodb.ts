import mongoose from "mongoose";

// ! always invoke this method before using it within other parts of the application.
export default function connectMongodb(mongoUrl: string) {
  try {
    mongoose.set("strictQuery", false);
    mongoose.createConnection(mongoUrl, (err: any) => {
      if (err)
        return console.log(`Error connecting to mongodb: ` + err?.message);
      console.info("Mongodb Connected");
    });
  } catch (e: any) {
    console.error(`Error connecting mongodb: ${e.message}`);
  }
}
