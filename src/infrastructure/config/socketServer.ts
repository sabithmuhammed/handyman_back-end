import { query } from "express";
import { Server, Socket } from "socket.io";

interface User {
    userId: string;
    socketId: string;
    online?: boolean;
    lastSeen: Date | string;
}

export default function initializeSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_URL,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            credentials: true,
        },
    });

    let users: User[] = [];

    // Socket helper functions

    const addUser = (userId: string, socketId: string) => {
        const userExist = users.find((user) => user.userId == userId);
        if (userExist) {
            userExist.socketId = socketId;
            userExist.online = true;
            userExist.lastSeen = new Date();
        } else {
            users.push({
                userId,
                socketId,
                online: true,
                lastSeen: new Date(),
            });
        }
        io.emit("userOnline", userId);
    };

    const removeUser = (socketId: string) => {
        users.forEach((user) => {
            if (user.socketId === socketId) {
                const lastSeen = new Date();
                io.emit("userOffline", { userId: user.userId, lastSeen });
                user.online = false;
                user.lastSeen = lastSeen
            }
        });
        console.log(users, "offline");
    };

    const getUser = (userId: string) =>
        users.find((user) => user.userId === userId);

    // Socket connection

    io.on("connection", (socket: Socket) => {
        const userId = socket.handshake.query.userId;
        const tradesmanId = socket.handshake.query.tradesmanId;
        addUser(userId as string, socket.id);
        if ((tradesmanId as string) != "null") {
            addUser(tradesmanId as string, socket.id);
        }

        socket.on("sendMessage", (data) => {
            const user = getUser(data.message.receiverId);

            if (user) {
                if (data.toTradesman) {
                    io.to(user.socketId).emit(
                        "newMessageTradesman",
                        data.message
                    );
                } else {
                    io.to(user.socketId).emit("newMessageUser", data.message);
                }
                io.to(user.socketId).emit("msg", { userId });
            }
        });

        socket.on("getLastSeen", (userId, ackCallback) => {
            const user = getUser(userId);
            ackCallback({
                online: user?.online,
                lastSeen: user?.lastSeen,
            });
            console.log(users, "ghhghj");
        });
        socket.on("disconnect", () => {
            removeUser(socket.id);
            console.log("User disconnected");
        });
    });
}
