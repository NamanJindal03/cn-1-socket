import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('Connection intiated');

    //handle socket code
    socket.on('first-timer', (message) => {
        console.log(message);
        socket.emit('revert', 'yes yes yes yes');
    })

    socket.on('disconnect', ()=>{
        console.log('connection disconnected')
    })
})


server.listen(3000, ()=>{
    console.log('server listening at port 3000');
})

