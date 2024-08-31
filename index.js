import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectionToMongo } from './db.js';
import { chatModel } from './chat.schema.js';

const app = express();
app.use(cors());

let users = 0;

const server = http.createServer(app);
connectionToMongo()
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('Connection intiated');

    //handle socket code
    // socket.on('first-timer', (message) => {
    //     console.log(message);
    //     socket.emit('revert', 'yes yes yes yes');
    // })
    socket.on('store-user-info', async (username)=>{
        socket.userInfo = username;
        let chatHistoryData = await chatModel.find().sort({createdAt: 1}).limit(10);
        chatHistoryData = chatHistoryData.map((chat)=>{
            return {
                message: chat.message,
                user: chat.user,
                time: new Date(chat.createdAt).toDateString()
            }
        })
        socket.emit('chat-history', chatHistoryData)
    })

    socket.on('chat', async (message)=>{
        await chatModel.create({user: socket.userInfo, message: message})
        socket.broadcast.emit('broadcast_chat', `${socket.userInfo}: ${message}`)
    })

    //whenever I have to update the user count, I will be initiating this event
    socket.emit('users', users+1);

    socket.emit('weather_info_update', 'some new weather info')

    socket.on('is_typing', (data)=>{
        console.log(socket.userInfo)
        console.log('user is busy doing', data)
    })

    socket.on('disconnect', ()=>{
        console.log('connection disconnected');
        users = users -1;
    })
})


server.listen(3000, ()=>{
    console.log('server listening at port 3000');
})

