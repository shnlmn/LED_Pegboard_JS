let pegboard;
function setup() {
  this.animation = new pbAnimation();
  Pegboard.preload(); // preload background image
  this.pegboard = new Pegboard();
  createCanvas(this.pegboard.display_w, this.pegboard.display_h).position(
    ...this.pegboard.canvas_position
  );
  loadPixels();
}

function draw() {
  // loadPixels();
  // updatePixels()
  this.animation.display();
  // this.pegboard.read_pegs();
  // image(Pegboard.backImg, 0, 0)
  this.pegboard.display_pegs();
  // updatePixels()
  // loadPixels();
}

function mouseClicked(e) {
  this.animation.mouseClicked(e);
}
