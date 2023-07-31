let pegboard;
function setup() {
  this.animation = new pbAnimation();
  // Pegboard.preload(); // preload background image
  this.pegboard = new Pegboard();
  createCanvas(this.pegboard.display_w, this.pegboard.display_h).position(
    ...this.pegboard.canvas_position
  );
  loadPixels();
}

function draw() {
  this.animation.display();
  loadPixels();
  this.pegboard.display_pegs();
  print(getFPS())
}

function mouseClicked(e) {
  // this.pegboard.mouseClicked(e);
  this.animation.mouseClicked(e);
}
