import { query } from "express";
import { Server, Socket } from "socket.io";

interface User {
    userId: string;
    socketId: string;
    online?: boolean;
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
        } else {
            users.push({ userId, socketId, online: true });
        }
        console.log(users);

        io.emit("userOnline", userId);
    };

    const removeUser = (socketId: string) => {
        users.map((user) => {
            if (user.socketId === socketId) {
                io.emit("userOffline", user.userId);
                return { ...user, online: false };
            }
            return user;
        });
    };

    const getUser = (userId: string) =>
        users.find((user) => user.userId === userId);

    // Socket connection

    io.on("connection", (socket: Socket) => {
        const userId = socket.handshake.query.userId;
        const tradesmanId = socket.handshake.query.tradesmanId;
        addUser(userId as string, socket.id);
        if (tradesmanId) {
            addUser(tradesmanId as string, socket.id);
        }
        console.log(`User connected with ID: ${userId}`);
        console.log(socket.handshake.query);

        socket.on("sendMessage", (data) => {
            const user = getUser(data.message.receiverId);
            console.log("message arrived", data);

            console.log(user);

            if (user) {
                if (data.toTradesman) {
                    io.to(user.socketId).emit(
                        "newMessageTradesman",
                        data.message
                    );
                } else {
                    io.to(user.socketId).emit("newMessageUser", data.message);
                }
                io.to(user.socketId).emit("msg",{userId});
            }
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}
