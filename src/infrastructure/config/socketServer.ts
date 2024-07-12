import { Server, Socket } from "socket.io";

interface User {
    userId: string;
    socketId: string;
    online?: boolean;
}

export default function initializeSocket(server: any) {
    console.log("hfdjshgshdfs");

    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_URL,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            credentials: true,
        },
    });

    let users: User[] = [];

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
        const user = users.find((user) => user.socketId === socketId);
        if (user) {
            user.online = false;
            io.emit("userOffline", user.userId);
        }
    };
    const getUser = (userId: string) =>
        users.find((user) => user.userId === userId);

    io.on("connection", (socket: Socket) => {
        const userId = socket.handshake.query.userId;
        addUser(userId as string, socket.id);
        console.log(`User connected with ID: ${userId}`);
        
        socket.on("sendMessage", (message) => {
            const user = getUser(message.receiverId);
            console.log(user);

            if (user) {
                io.to(user.socketId).emit("newMessage", message);
            }
        });
    });
}
