"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function initializeSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORS_URL,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            credentials: true,
        },
    });
    let users = [];
    // Socket helper functions
    const addUser = (userId, socketId) => {
        const userExist = users.find((user) => user.userId == userId);
        if (userExist) {
            userExist.socketId = socketId;
            userExist.online = true;
        }
        else {
            users.push({ userId, socketId, online: true });
        }
        console.log(users);
        io.emit("userOnline", userId);
    };
    const removeUser = (socketId) => {
        users.map((user) => {
            if (user.socketId === socketId) {
                io.emit("userOffline", user.userId);
                return Object.assign(Object.assign({}, user), { online: false });
            }
            return user;
        });
    };
    const getUser = (userId) => users.find((user) => user.userId === userId);
    // Socket connection
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        const tradesmanId = socket.handshake.query.tradesmanId;
        addUser(userId, socket.id);
        if (tradesmanId) {
            addUser(tradesmanId, socket.id);
        }
        console.log(`User connected with ID: ${userId}`);
        console.log(socket.handshake.query);
        socket.on("sendMessage", (data) => {
            const user = getUser(data.message.receiverId);
            console.log("message arrived", data);
            console.log(user);
            if (user) {
                if (data.toTradesman) {
                    io.to(user.socketId).emit("newMessageTradesman", data.message);
                }
                else {
                    io.to(user.socketId).emit("newMessageUser", data.message);
                }
                io.to(user.socketId).emit("msg", { userId });
            }
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}
exports.default = initializeSocket;
//# sourceMappingURL=socketServer.js.map