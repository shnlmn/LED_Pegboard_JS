const express = require("express");
const app = express();
const server = require("node:http").createServer(app);
const io = require("socket.io")(server);
// const path = require('path');

// 0000000000000000000000000000000000000000000000
//                     Serial Port
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", function (data) {
  // console.log(data)
  io.emit("serialData", data);
});
// 00000000000000000000000000000000000000000000000000

// 111111111111111111111111111111111111111111111111111
//                     Express

// Express setup
app.use(express.static("./public"));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'ejs');

const base_scripts = [
  "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
  "https://cdn.socket.io/socket.io-3.0.5.min.js",
  "/lib/p5.js",
  "/lib/p5play.min.js",
  "/lib/planck.min.js",
  "/src/sketch.js",
  "/src/pegboard.js",
];

const games = [
  { name: "Batter Up!", script: "ball_bats.js" },
  { name: "Blasters!", script: "ball_cannon.js" },
  { name: "Pingball", script: "ball.js" },
  { name: "Trampoline!", script: "bubble_bounce.js" },
  { name: "Word Jumble", script: "spelling_braille.js" },
  { name: "Ambient Background", script: "ambient.js" },
  { name: "Peg Mapping", script: "peg_map.js" },
];

// Render the landing page //
app.get("/", (req, res) => {
  res.send(renderLandingPage());
});

function renderLandingPage() {
  const gameLinks = games.map(
    (game) => `<li><a href="/run-script/${game.script}">${game.name}</a></la>`
  );
  return `
        <html>
            <head>
                <title>Pegboard Games</title>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
    /> <link rel="stylesheet" type="text/css" href="../style.css" />
            </head>
            <body>
                <h1>Pegboard Games</h1>
                <ul>
                    ${gameLinks.join("")}
                </ul>
            </body>
        </html>
    `;
}

// Route handler for each game //
app.get("/run-script/:script", (req, res) => {
  const selectedScript = req.params.script;
  const scriptsToInclue = [...base_scripts, `/games/${selectedScript}`];
  res.send(renderHtmlTemplate(selectedScript, scriptsToInclue));
});

function renderHtmlTemplate(selectedScript,scriptsToInclude) {
  const scriptTags = scriptsToInclude.map(
    (script) => `<script src="${script}" type="text/javascript"></script>`
  );
  return `
        <html>
            <head>
                <title>Pegboard Games</title>
                ${scriptTags.join("")}
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" /> 
                <link rel="stylesheet" type="text/css" href="../style.css" />
            </head>
            <body>
                <h1>${selectedScript}</h1>
                <div id="sketch-holder"></div>
            </body>
        </html>
    `;
}
server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
