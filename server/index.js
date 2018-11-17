const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const app = express();
const path = require('path')

const server = app.listen(PORT, () => {
    console.log(`Now connected on port ${PORT}`)
});

const io = require('socket.io')(server);

// handle sockets
require('./socket')(io);
// io.on('connection', socket =>{
//     console.log('HELLO');
// });

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

module.exports = app;