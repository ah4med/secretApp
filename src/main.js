import express from "express";
import { dbConnection } from "./DB/connection.js";
import * as userRouters from "./Modules/User/user.controller.js";
import { config } from "dotenv";
import controllerHandler from "./Utils/routers-handler.util.js";
// config({ path: `src/config/.${process.env.NODE_ENV}.env` });
config();

async function bootstrap() {
  const app = express();
  app.use(express.json());

  // app.use("/user", userRouters.userController); // using "user" as a prefix for all routes in userController
  // app.use("/post", postRouters.postController); // using "post" as a prefix for all routes in postController

  // using controllerHandler for all routers
  controllerHandler(app);
  await dbConnection();
  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}

export default bootstrap;
