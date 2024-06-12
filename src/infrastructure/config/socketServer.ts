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
            credentials:true
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
        console.log("user connected", socket.id);

        socket.on("addUser", ({userId}) => {
            addUser(userId, socket.id);
        });
        socket.on("sendMessage", (message) => {
            console.log(message);
            
            const user = getUser(message.receiverId);
            console.log(user);
            
            if (user) {

                io.to(user.socketId).emit("newMessage", message);
            }
        });

        // socket.on("sendMessage",({senderId,receiverId,text}) =>{
        //     console.log('senddddddddd',senderId,receiverId,text)
        //     const user = getUser(receiverId)
        //     console.log(user);

        //     if(user){
        //         io.to(user.socketId).emit("getMessage",{senderId,text})
        //     }
        // });

        // socket.on('image',(imageData:object) =>{
        //     console.log("recieved image data",imageData);
        //     socket.broadcast.emit("image",imageData)

        // })

        // socket.on("disconnect",() =>{
        //     console.log("user disconnected")
        //     removeUser(socket.id).catch(err =>console.log('error during removal of user'));
        //     io.emit("userOnline",users.filter(user =>user.online))

        // })
    });
}
