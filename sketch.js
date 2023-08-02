let pegboard;
let analog_pegs;
p5.disableFriendlyErrors = true;
function setup() {
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
  this.bg = createGraphics(this.pegboard.display_w, this.pegboard.display_h);
  this.bg.fill(20);
  this.bg.rect(0, 0, this.pegboard.display_w, this.pegboard.display_h);
  image(this.bg, 0, 0);
}

function draw() {
  this.animation.display();
  loadPixels();
  this.analog_pegs.display();
  image(Pegboard.backgroundImg, 0, 0);
  this.pegboard.display_pegs();
  textSize(32);
  fill("white");
  text(getFPS(), 0, 60);
  // print(getFPS())
}

function mouseClicked(e) {
  // this.analog_pegs.mouseClicked(e);
  this.animation.mouseClicked(e);
}
