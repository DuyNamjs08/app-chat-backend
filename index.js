const express = require("express")
const cors = require('cors')
require("dotenv").config()
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.route')
const messageRoutes = require('./routes/message.route')
const socket = require('socket.io')

const PORT = process.env.PORT || 6000
const app = express()

app.use(cors())
app.use(express.json())
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('conected DB success')
}).catch(err => {
    console.log(err.message)
})
app.use('/api/auth', userRoutes)
app.use('/api/messages', messageRoutes)
const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

const io = socket(server , {
    cors:{
        origin:'http://localhost:3000',
        Credentials:true
    }
});
 global.onlineUsers = new Map();
io.on('connection' , (socket)=>{
    global.chatSocket = socket;

    socket.on("add-user" , (userId)=>{
        onlineUsers.set(userId , socket.id)
    });

    socket.on('send-msg' , (data) =>{
        console.log(data)
        const sendUserSocket = onlineUsers.get(data.to);
        console.log(sendUserSocket)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve" , data.msg)
        }
    })
})
