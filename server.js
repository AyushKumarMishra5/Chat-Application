const io = require('socket.io')(3000, {
    cors: {
        origin: "http://127.0.0.1:5500", 
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
        socket.emit('chat-message', { message: 'Hello, welcome to the chat-room', name: 'Owner  ' });
    });

    socket.on('send-chat-message', message => {
        const userName = users[socket.id] || 'Unknown';
        socket.broadcast.emit('chat-message', { message:  message, name: userName });
    });

    socket.on('disconnect', () => {
        const userName = users[socket.id];
        if (userName) {
            socket.broadcast.emit('user-disconnected', userName);
            delete users[socket.id];
        }
    });
});
