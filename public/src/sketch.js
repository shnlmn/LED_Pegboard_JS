let analog_pegs;
p5.disableFriendlyErrors = true;

const socket = io("http://localhost:5000");
socket.on("connect", () => {
  console.log("connected");
});

function setup() {
  Pegboard.preload(); // preload background image
  ///// Load the animation and pegboard classes
  this.animation = new pbAnimation();
  this.pegboard = new Pegboard();
  socket.on("serialData", (data) => {
    this.animation.process_serial_data(data);
  });

  // create the canvas
  createCanvas(this.pegboard.display_w, this.pegboard.display_h);
  loadPixels(); // p5 function to load pixel data
  this.bg = createGraphics(this.pegboard.display_w, this.pegboard.display_h); // create a graphics object to draw the background
  this.bg.fill(20); // set the background color
  this.bg.rect(0, 0, this.pegboard.display_w, this.pegboard.display_h); // draw the background
  image(this.bg, 0, 0); // draw the background to the canvas
  pixelDensity(1); // set the pixel density to 1 to avoid scaling on mobile
}

function draw() {
  this.animation.display(); // load the animation display frame
  loadPixels(); // load pixels from the canvas
  image(Pegboard.backgroundImg, 0, 0); // draw the background image
  // this.animation.display_pegs(); // draw the pegs (inherited from Pegboard)
  this.pegboard.display_pegs(); // draw the pegs (inherited from Pegboard)

  // show FPS
  textSize(32);
  fill("white");
  text(getFPS(), 0, 60);
}

function mouseClicked(e) {
  this.animation.mouseClicked(e);
}
