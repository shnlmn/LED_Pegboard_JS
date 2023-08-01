let pegboard;
let analog_pegs;
p5.disableFriendlyErrors = true;
function setup() {
  // imageMode(CENTER)
  Pegboard.preload(); // preload background image
  this.animation = new pbAnimation();
  this.analog_pegs = new Analog_pegs();
  this.animation.preload(() => {
    draw();
  });
  this.pegboard = new Pegboard();
  createCanvas(
    this.pegboard.display_w,
    this.pegboard.display_h + this.analog_pegs.key_height
  ).position(...this.pegboard.canvas_position);
  loadPixels();
}

function draw() {
  this.animation.display();
  loadPixels();
  this.analog_pegs.display();
  image(Pegboard.backgroundImg, 0, 0);
  this.pegboard.display_pegs();
  // print(getFPS())
}

function mouseClicked(e) {
  // this.analog_pegs.mouseClicked(e);
  this.animation.mouseClicked(e);
}
