import { globalErrorHandler } from "../Middleware/error-handler-middleware.js";
import * as controllers from "../Modules/index.js";

// Routers (controllerHandler / routersHandler)

const controllerHandler = (app) => {
  // any router related to user / using user as a prefix for all routes in userController
  app.use("/user", controllers.userController);

  // any router related to auth / using auth as a prefix for all routes in authRouter
  app.use("/auth", controllers.authRouter);

  // any router related to messages / using messages as a prefix for all routes in messageController
  app.use("/messages", controllers.messageController);

  //===================================================================================================//
  // home page
  app.get("/", (req, res) => {
    res.send("Hello fluff");
  });
  // handle not found routes
  app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // global error handler
  app.use(globalErrorHandler);
};
export default controllerHandler;
