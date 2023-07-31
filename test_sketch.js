let testClass;
function setup() {
//   TestClass.preload(); // preload background image
  this.testClass = new TestClass();
  this.animation = new Animation();
  print(this.animation)
  createCanvas(this.testClass.display_w, this.testClass.display_h).position(
    ...this.testClass.canvas_position
  );
//   loadPixels();
}

function draw() {
  this.animation.display();
  loadPixels();
  updatePixels();
  this.testClass.display_pegs();
}

