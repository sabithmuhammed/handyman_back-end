import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session, { SessionOptions } from "express-session";
import http from "http";

//route imports
import userRouter from "../router/userRoute";


import errorHandler from "../middlewares/errorhandler";

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//allow requests from frontend server

app.use(
    cors({
        origin: process.env.CORS_URL,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // to send cookies or authentication headers
    })
);

const sessionOptions: SessionOptions = {
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000,
    },
};

app.use(session(sessionOptions));

//using routes
app.use("/api/users", userRouter);

app.use(errorHandler);

export { httpServer };
