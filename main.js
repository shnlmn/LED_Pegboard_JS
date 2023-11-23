const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Create a port
const port = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 115200,
})

module.exports = port;