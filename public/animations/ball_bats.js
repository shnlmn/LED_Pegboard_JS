class pbAnimation extends Pegboard {
  constructor() {
    super();
    this.speed = 0.3 * this.scale;
    this.speed_floor = 20 * this.scale;
    this.circle_distance = 4 * this.scale;
    this.ball_diameter = 4 * this.board_peg_size;
    this.location = createVector(0, 0);
    this.travel_vector = createVector(0, 0);
    this.to_node = 0;
    this.start_point = 0;
    this.active_D_count = 0;
    this.active_A_count = 0;
    this.peg_coords = this.get_peg_coords();
    this.paddles = new Group();
    this.balls = new Group();
    world.gravity.y = 1;
    for (let i = 0; i < 100; i++) {
      let x = ~~(Math.random() * this.display_w);
      let y = ~~(Math.random() * this.display_h);
      let ball = new this.balls.Sprite(x, y, this.board_peg_size * 4);
      ball.strokeWeight = 0;
      ball.friction = 0.01;
    }
  }

  display() {
    background(100, 100);
    this.paddles.draw();
    this.balls.draw();
    if (frameCount % 5 == 0) {
      new this.balls.Sprite(~~(Math.random() * this.display_w), -150).d =
        this.board_peg_size * 4;
      this.balls.strokeWeight = 0;
      this.balls.friction = 0.01;
    }
  }
  preload(){

  }
  ///// detect mouse click, find closest peg, and add a sprite
  mouseClicked(e) {
    let peg_D_obj, peg_A_obj;
    [peg_D_obj, peg_A_obj] = this.toggle_peg();
    if (peg_D_obj) {
      const coords = peg_D_obj['coord']
      let new_peg = true;
      for (let index = 0; index < this.paddles.length; index++) {
        const paddle = this.paddles[index];
        if (paddle.peg_number == peg_D_obj["number"]) {
          paddle.remove();
          new_peg = false;
        }
      }
      if (new_peg) {
        let paddle = new this.paddles.Sprite(coords.x, coords.y, 80, 10, "k");
        paddle.color = "red";
        paddle.strokeWeight = 0;
        paddle.offset.x = 30;
        const direction = Math.random()<0.5 ? 1 : -1;
        print(direction)
        paddle.rotationSpeed = direction * 10;
      }
    }
  }
}
