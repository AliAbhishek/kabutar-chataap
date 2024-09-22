import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./DBConnection/DBconnection.js"
import userRouter from "./Routes/userRoutes.js"
import chatRouter from "./Routes/chatRoutes.js"
import messageRouter from "./Routes/messageRouter.js"
import { Server } from "socket.io";
import { notificationService } from "./Services/notificationService.js"
import { authenticateSocket } from "./middlewares/UserAuthenticate.js"
import User from "./Models/userModel.js"
import Chat from "./Models/chatModel.js"

dotenv.config()

connectDB()

const app = express()
app.options("", cors({
    origin: "*", // Allow both production and local development
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))
app.use(cors({
    origin: "*", // Allow both production and local development
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())


app.get("/", (req, res) => {
    res.send("hiiiiiiiii")
})
app.get("/user1", (req, res) => {
    res.send("user1")
})
app.post("/user1/login", (req, res) => {
    res.send("login1")
})

app.use("/user", userRouter)
app.use("/chat", chatRouter)
app.use("/message", messageRouter)
app.use(express.static("public"))

// =======================================deployment===================================

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname1, "/frontend/dist")));

//     app.get("*", (req, res) =>
//         res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
//     );

// } else {
//     app.get("/", (req, res) => {
//         res.send("API is running..");
//     });
// }


// ==================================================================================


let port = process.env.PORT

//==================================================================================



const server = app.listen(port, async () => {
    console.log(`Express connected on ${port}`)
    // await connectWithRetry()
}


)
const io = new Server(server, {
    cors: {
        origin: "*", // Allow both production and local development
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
        
    }
});



io.use(authenticateSocket);
// Handle socket connections
io.on("connection", (socket) => {

    console.log("Connected to Socket.IO", `${socket?.id}`);
    socket.on("setup", (userData) => {
        socket.join(userData?._id)
        console.log(userData?._id, "userId")

    })
    socket.on("joinchat", (room) => {
        socket.join(room)
        console.log(room, "joined room ")

    })

    socket.on("send-message", async ({ message, room }) => {



        socket.to(room).emit("receive-message", message)

        let chatData = await Chat.findById(room)
        console.log(chatData, "chatData")



        if (socket.request.user) {
            // const user = await User.findById(socket.request?.user?.userId);
            // const user = await User.findById(socket.request?.user?.userId);


            if (chatData?.isGroupChat === false) {
                const otherUser = chatData?.users.find(
                    user => user.toString() !== socket.request?.user?.userId.toString()
                );
                console.log(otherUser,"other")

                if (otherUser) {
                    // Fetch the user data from the User model
                    const otherUserData = await User.findById(otherUser);
                    console.log('Found other user:', otherUserData);
                    // You can now use `otherUserData` for further operations

                    await notificationService.sendNotification(`New Message from ${socket.request?.user?.name}`, message, otherUser);
                } else {
                    console.log('No other user found');
                }
            } else {
                const usersToNotify = chatData?.users.filter(
                    user => user.toString() !== socket.request?.user?.userId.toString()
                );

                for (const userId of usersToNotify) {
                    const userData = await User.findById(userId);
                    if (userData) {
                        await notificationService.sendNotification(`New Message in ${chatData?.chatName}`, message, userId);
                        console.log(`Notification sent to ${userData.name}`);
                    }
                }

            }

        } else {
            console.error('User not authenticated for notifications');
        }
    })
    socket.on("typing", (chat) => {

        socket.to(chat).emit("typing");

    })
    socket.on("stop typing", (chat) => {

        socket.to(chat).emit("stop typing");
    })

    // socket.on("typing", (room) => socket.to(room).emit("typing"));
    // socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));





});







