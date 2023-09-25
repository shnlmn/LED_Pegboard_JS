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
    this.connectedPairs = new Set();
    this.peg_coords = this.get_peg_coords();
    this.particles = new Group();
    this.particles.d = this.board_peg_size * 3;
    this.particles.strokeWeight = 0;
    this.balls = new Group();
    this.balls.strokeWeight = 0;
    this.balls.d = this.board_peg_size * 6;
    this.ropes = new Group();
    this.ropes.strokeWeight = this.board_peg_size * 2;
    this.ropes.collider = "k";
    this.pegs = new Group();
    this.pegs.strokeWeight = 0;
    this.pegs.collider = "none";
    this.pegs.d = this.board_peg_size + 1;
    world.gravity.y = 13;
    this.target;
    this.random_ball_og = this.display_w / 2;
    this.random_ball_vel_x = 0;
    this.margin = 100;
    this.set_target();
  }
  arrayRange(start, stop, step) {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );
  }
  remapToLogScale(number, inputMin, inputMax, outputMin, outputMax) {
    // Invert the number with respect to the input range
    let invertedNumber = inputMax - (number - inputMin);

    // Map the inverted number from the original range [inputMin, inputMax] to the logarithmic scale [log(inputMax), log(inputMin)]
    let mappedValue = Math.log(invertedNumber);

    // Map the logarithmic value back to the desired output range [outputMin, outputMax]
    return (
      outputMin +
      ((outputMax - outputMin) * (mappedValue - Math.log(inputMax))) /
        (Math.log(inputMin) - Math.log(inputMax))
    );
  }
  set_target() {
    this.target = new Sprite();
    this.target.d = this.board_peg_spacing * 6;
    this.target.x =
      Math.random() * (this.display_w - this.margin) + this.margin;
    this.target.y =
      Math.random() * (this.display_h / 2 - this.margin) + this.margin;
    const closest_peg = this.peg_coords.reduce((a, b) => {
      let a_dist = dist(a[0], a[1], this.target.x, this.target.y);
      let b_dist = dist(b[0], b[1], this.target.x, this.target.y);
      return a_dist < b_dist ? a : b;
    });
    this.target.x = closest_peg[0];
    this.target.y = closest_peg[1];
    this.target.collider = "s";
    this.target.stroke = "red";
    // this.target.shapeColor= (100, 0)
    this.target.shapeColor.setAlpha(0);
    this.target.strokeWeight = 12;
    this.target.collides(this.balls, (target, ball) => {
      this.new_target(target, ball);
    });
  }
  new_target(target, ball) {
    this.pop(target);
    target.remove();
    ball.remove();
    this.set_target();
    this.random_ball_og = Math.random() * (width-100) + 100;
    this.random_ball_vel_x =
     0.001 * (width / 2 - this.random_ball_og);
     print(this.random_ball_vel_x, this.random_ball_og, width)
  }
  pop(ball) {
    for (let i = 0; i < 10; i++) {
      let p = new this.particles.Sprite(ball.x, ball.y);
      p.direction = random(360);
      p.speed = random(3, 5);
      p.life = 45;
    }
  }
  preload(callback) {}

  update_ropes() {}

  display() {
    background(60, 50);
    if (frameCount % 50 == 0) {
      print(this.random_ball_vel_x)
      let new_ball = new this.balls.Sprite(this.random_ball_og, -10);
      new_ball.vel.x = this.random_ball_vel_x;
      new_ball.vel.y = 15;
    }
    this.ropes.draw();
    this.balls.draw();
    this.pegs.draw();
    this.target.draw();
    this.particles.draw();
  }
  mouseClicked(e) {
    let peg_D_obj, peg_A_obj;
    [peg_D_obj, peg_A_obj] = this.toggle_peg(e);
    if (peg_D_obj) {
      let add_peg = true;
      for (let index = 0; index < this.pegs.length; index++) {
        const peg = this.pegs[index];
        if (peg.peg_number == peg_D_obj["number"]) {
          peg.remove();
          add_peg = false;
        }
      }
      if (add_peg) {
        let coord = peg_D_obj["coord"];
        this.pegs.fill = "white";
        let new_peg = new this.pegs.Sprite(coord.x, coord.y);
        new_peg.peg_number = peg_D_obj["number"];
      }
    }
    this.ropes.removeAll();
    for (let i = 0; i < this.pegs.length; i++) {
      for (let j = 0; j < this.pegs.length; j++) {
        let d = dist(
          this.pegs[i].x,
          this.pegs[i].y,
          this.pegs[j].x,
          this.pegs[j].y
        );
        if (d > 0 && d < this.board_peg_spacing * 15) {
          // let pairKey = this.getPairKey(i, j);
          // if (!this.connectedPairs.has(pairKey)) {
          let rope = new this.ropes.Sprite([
            [this.pegs[i].x, this.pegs[i].y],
            [this.pegs[j].x, this.pegs[j].y],
          ]);
          rope.collides(this.balls, (rope, ball) => {
            let remap = this.remapToLogScale(
              d,
              this.board_peg_spacing * 2,
              this.board_peg_spacing * 15,
              0.01,
              10
            );
            print(remap);
            if (isNaN(remap) || remap > 1000) {
              remap = 1;
            }
            ball.addSpeed(remap);
          });
          // this.connectedPairs.add(pairKey);
          // }
        }
      }
    }
    this.ropes.draw();
  }
}
