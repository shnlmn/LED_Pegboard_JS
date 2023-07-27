function setup() {
  animation = new pbAnimation();
  pegboard = new Pegboard();
  pixel_mask = null;
  // let ball = [];


  createCanvas(pegboard.display_w, pegboard.display_h).position(...pegboard.canvas_position);

  background(55);
  pg = createGraphics(pegboard.display_w, pegboard.display_h);
  // pg.background(255, 0, 0);
  // pg.fill(0);
  // pg.strokeWeight(0);
  // for (let i = 0; i < Object.entries(animation.peg_coords).length; i++) {
  //   pg.circle(animation.peg_coords[i][0], animation.peg_coords[i][1]);
  // }
  // pgMask = pg.loadPixels();
}

function draw() {
  fill(155);
  this.pegboard.display_pegs();
  this.animation.display();
}

function mouseClicked(e) {
  this.animation.mouseClicked(e);
}
