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
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Secret App</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background-color: #2f2f2f;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #1f1f1f;
      max-width: 960px;
      width: 90%;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 0 15px rgba(0,0,0,0.5);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
    }

    .text {
      flex: 1 1 45%;
    }

    .text h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .text p {
      line-height: 1.6;
      color: #ccc;
    }

    .features {
      margin: 1rem 0;
      list-style: none;
      padding: 0;
    }

    .features li::before {
      content: "✔️ ";
      color: #ffd700;
    }

    .btn {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: #6c63ff;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 1rem;
      cursor: pointer;
    }

    .img {
      flex: 1 1 45%;
      text-align: center;
    }

    .img img {
      width: 80%;
      max-width: 300px;
    }

    @media (max-width: 768px) {
      .container {
        flex-direction: column;
        text-align: center;
      }

      .img img {
        width: 60%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="text">
      <h1>SECRET APP</h1>
      <p>Send messages anonymously. Our system is designed for complete privacy and simplicity.</p>
      <ul class="features">
        <li>Anonymous Mode</li>
        <li>Secure Communication</li>
      </ul>
      <button class="btn">Enter Now</button>
    </div>
    <div class="img">
      <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Incognito Character">
    </div>
  </div>
</body>
</html>
      `);
  });
  // handle not found routes
  app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // global error handler
  app.use(globalErrorHandler);
};
export default controllerHandler;
