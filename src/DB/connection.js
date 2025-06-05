//-----------------------connecting to the db with mongodb native driver---------------------------
// import { MongoClient } from "mongodb"; // getting the MongoClient

// const client = new MongoClient("mongodb://localhost:27017"); // creating a new MongoClient

// const dbName = "secretApp";
// export const db = client.db(dbName); // getting the db & exporting it to use methods on it

// export const dbConnection = async () => {
//   // exporting a function to connect to the db
//   try {
//     await client.connect();
//     console.log(`Connected to ${dbName}`);
//   } catch (error) {
//     console.log(`DB connection failed`, error);
//   }
// };

//-----------------------connecting to the db with mongoose---------------------------//
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`connected to ${process.env.DB_URI}`);
  } catch (error) {
    console.log(`DB connection failed`, error);
  }
};
