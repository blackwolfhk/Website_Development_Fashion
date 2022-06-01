import express from "express";
import path from "path";
import { productRoutes } from "./routes/productRoutes";
import { userRoutes } from "./routes/userRoutes";
import { connectDB } from "./utils/db";
import env from "./utils/env";
import { expressSessionMiddleware } from "./utils/middleware";
// import {Server as SocketIO} from 'socket.io';
// import { setSocketIO } from "./utils/socketIO";
import grant from "grant";
import { logger } from "./utils/logger";
import { isloggedin } from "./utils/guard";

let app = express();
app.use(expressSessionMiddleware);
declare module "express-session" {
  interface SessionData {
    user?: any;
    name?: string;
  }
}

// to teach server know how to handle request from json data
app.use(express.json());

// product setting
app.use(productRoutes);

// signup setting
app.use(userRoutes);

const grantExpress = grant.express({
  defaults: {
    origin: `http://localhost:${env.SERVER_PORT}`,
    transport: "session",
    state: true,
  },
  google: {
    key: env.GOOGLE_CLIENT_ID,
    secret: env.GOOGLE_CLIENT_SECRET,
    scope: ["profile", "email"],
    callback: "/login/google",
  },
});

app.use(grantExpress as express.RequestHandler);

app.use(express.static("public"));
app.use(express.static("public/html"));

app.use(isloggedin, express.static("protected"));

app.get("/", (req, res) => {
  res.json({ message: "connect ok" });
});

app.use((req, res) => {
  res.sendFile(path.resolve(path.join("public", "html", "404.html")));
});

app.listen(env.SERVER_PORT, () => {
  logger.info(`listening on http://localhost:${env.SERVER_PORT}`);
  connectDB();
});
