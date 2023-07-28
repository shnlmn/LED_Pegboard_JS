class pbAnimation extends Pegboard {
  constructor() {
    super();
    this.speed = 0.3 * this.scale;
    this.speed_floor = 20 * this.scale;
    this.circle_distance = 4 * this.scale;
    this.ball_diameter = 4 * this.board_peg_size;
    this.orbit_x = 0;
    this.orbit_y = 0;
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
      print(x, y);
      let ball = new this.balls.Sprite(x, y, this.board_peg_size * 4);
      ball.friction = 0.01;
    }
  }

  orbit() {
    this.orbit_x =
      Math.sin(frameCount * this.speed * 0.15) * this.circle_distance;
    this.orbit_y =
      Math.cos(frameCount * this.speed * 0.15) * this.circle_distance;
  }

  random_color() {
    colors = [
      "#90BE6D",
      "#43AA8B",
      "#4D908E",
      "#577590",
      "#277DA1",
      "#F94144",
      "#F3722C",
      "#F8961E",
      "#F9844A",
      "#0099FF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  display() {
    clear();
    background("#020");
    this.paddles.draw();
    this.balls.draw();
    if (frameCount % 5 == 0) {
      new this.balls.Sprite(~~(Math.random() * this.display_w), -150).d =
        this.board_peg_size * 4;
    }
  }
  mouseClicked(e) {
    for (const [k, v] of Object.entries(this.peg_D_inputs)) {
      const actual_x = e.x - this.canvas_position[0];
      const actual_y = e.y - this.canvas_position[1];
      let vD = v;
      if (
        Math.abs(actual_x - vD[0]) <= this.board_peg_size &&
        Math.abs(actual_y - vD[1]) <= this.board_peg_size
      ) {
        print(k, v);

        let paddle = new this.paddles.Sprite(v[0], v[1], 80, 10, "k");
        paddle.color = "red";
        paddle.offset.x = 40;
        paddle.rotationSpeed = 10;
        print("HIT A PEG");
        print(k, this.peg_D_inputs[k]);
        this.peg_D_state[k] = !this.peg_D_state[k];
      }
    }
  }
}
