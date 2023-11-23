const express = require('express');
const app = express();
const server  = require('node:http').createServer(app);
const io = require('socket.io')(server);
// const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected')
        })
    });

const port = new SerialPort({
    path: '/dev/ttyUSB0',
    baudRate: 115200,
    })

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

parser.on('data', function (data) {
    // console.log(data)
    io.emit('serialData', data)
    })

app.use(express.static('./public'));

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
