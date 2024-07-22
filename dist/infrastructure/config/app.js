"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
//route imports
const userRoute_1 = __importDefault(require("../router/userRoute"));
const commonRoute_1 = __importDefault(require("../router/commonRoute"));
const tradesmanRoute_1 = __importDefault(require("../router/tradesmanRoute"));
const adminRoute_1 = __importDefault(require("../router/adminRoute"));
const bookingRoute_1 = __importDefault(require("../router/bookingRoute"));
const postRoute_1 = __importDefault(require("../router/postRoute"));
const errorhandler_1 = __importDefault(require("../middlewares/errorhandler"));
const chatRoute_1 = __importDefault(require("../router/chatRoute"));
const socketServer_1 = __importDefault(require("./socketServer"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
exports.httpServer = httpServer;
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
//allow requests from frontend server
app.use((0, cors_1.default)({
    origin: process.env.CORS_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // to send cookies or authentication headers
}));
const sessionOptions = {
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000,
    },
};
app.use((0, express_session_1.default)(sessionOptions));
//using routes
app.use("/api/users", userRoute_1.default);
app.use("/api/common", commonRoute_1.default);
app.use("/api/tradesman", tradesmanRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
app.use("/api/chat", chatRoute_1.default);
app.use("/api/booking", bookingRoute_1.default);
app.use("/api/post", postRoute_1.default);
app.use(errorhandler_1.default);
(0, socketServer_1.default)(httpServer);
//# sourceMappingURL=app.js.map