import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session, { SessionOptions } from "express-session";
import http from "http";
import morgan from "morgan";

//route imports
import userRouter from "../router/userRoute";
import commonRouter from "../router/commonRoute";
import tradesmanRouter from "../router/tradesmanRoute";
import adminRouter from "../router/adminRoute";
import bookingRouter from "../router/bookingRoute";
import postRouter from "../router/postRoute";

import errorHandler from "../middlewares/errorhandler";
import chatRouter from "../router/chatRoute";
import initializeSocket from "./socketServer";

const app = express();
const httpServer = http.createServer(app);
app.use(morgan("dev"));
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
app.use("/api/common", commonRouter);
app.use("/api/tradesman", tradesmanRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/post", postRouter); 

app.use(errorHandler);

initializeSocket(httpServer);
export { httpServer };
